import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  RespondToAuthChallengeCommand,
  RespondToAuthChallengeCommandInput,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { cognitoConfig } from "@/lib/configs/aws-cognito";
import { z } from "zod";

const COGNITO_DOMAIN = "us-east-2flbolrqfv.auth.us-east-2.amazoncognito.com";
const CLIENT_ID = "6fajlmd3ran2auiu6vqn1d00kt";
const REDIRECT_URI = "http://localhost:3000/auth/login";

const cognitoClient = new CognitoIdentityProviderClient({
  region: cognitoConfig.region,
});

const parseJwt = (token: string | null) => {
  if (token === null) return null;

  const base64Url = token.toString().split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );

  return JSON.parse(jsonPayload);
};

const authDataSchema = z.object({
  userAccessToken: z.string().nullable(),
  userId: z.string().nullable(),
  userIdToken: z.string().nullable(),
  userRefreshToken: z.string().nullable(),
  userRole: z.string().nullable(),
});

type AuthData = z.infer<typeof authDataSchema>;

export const getAuthData = (): AuthData => {
  return {
    userAccessToken: localStorage.getItem("userAccessToken"),
    userId: localStorage.getItem("userId"),
    userIdToken: localStorage.getItem("userIdToken"),
    userRefreshToken: localStorage.getItem("userRefreshToken"),
    userRole: localStorage.getItem("userRole"),
  };
};

const setAuthDataFromTokens = (
  idToken: string,
  accessToken: string,
  refreshToken: string
) => {
  localStorage.setItem("userIdToken", idToken || "");
  localStorage.setItem("userAccessToken", accessToken || "");
  localStorage.setItem("userRefreshToken", refreshToken || "");

  const decodedUserIdToken = parseJwt(idToken || "");
  const userId = decodedUserIdToken["cognito:username"];
  const userRole = decodedUserIdToken["cognito:groups"]?.[0] ?? "";

  localStorage.setItem("userId", userId || "");
  localStorage.setItem("userRole", userRole || "");
};

export const setAuthDataFromCode = async (code: string) => {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
  });

  const response = await fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const tokens = await response.json();
  const idToken = tokens["id_token"];
  const accessToken = tokens["access_token"];
  const refreshToken = tokens["refresh_token"];

  if (
    idToken !== undefined &&
    accessToken !== undefined &&
    refreshToken !== undefined
  )
    setAuthDataFromTokens(idToken, accessToken, refreshToken);
};

export const signIn = async (username: string, password: string) => {
  const params: InitiateAuthCommandInput = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: cognitoConfig.clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const command = new InitiateAuthCommand(params);
    const result = await cognitoClient.send(command);

    const {
      AuthenticationResult,
      ChallengeName,
      ChallengeParameters,
      Session,
    } = result;

    if (
      ChallengeName === "NEW_PASSWORD_REQUIRED" &&
      ChallengeParameters !== undefined &&
      Session !== undefined
    ) {
      const userId = ChallengeParameters["USER_ID_FOR_SRP"];

      return {
        status: "NEW_PASSWORD_REQUIRED",
        params: {
          userId: userId,
          session: Session,
        },
      };
    }

    if (AuthenticationResult) {
      const idToken = AuthenticationResult.IdToken;
      const accessToken = AuthenticationResult.AccessToken;
      const refreshToken = AuthenticationResult.RefreshToken;

      if (
        idToken !== undefined &&
        accessToken !== undefined &&
        refreshToken !== undefined
      )
        setAuthDataFromTokens(idToken, accessToken, refreshToken);

      return {
        status: "LOGIN_SUCCESS",
        params: {},
      };
    }
  } catch (error) {
    if (typeof error === "object" && error !== null) {
      const err = error as { name?: string; message?: string; __type?: string };
      const awsErrorCode = err.name || err.__type || "UnknownError";
      const awsMessage = err.message || "Something went wrong.";

      switch (awsErrorCode) {
        case "UserNotFoundException":
          throw new Error("No account found with that email");
        case "NotAuthorizedException":
          throw new Error("Incorrect username or password");
        case "LimitExceededException":
          throw new Error(
            "Too many attempts. Please wait and try again later."
          );
        default:
          throw new Error(awsMessage);
      }
    }

    throw new Error("An unknown error occurred.");
  }
};

export const completeNewPassword = async (
  username: string,
  newPassword: string,
  session: string
) => {
  const input: RespondToAuthChallengeCommandInput = {
    ClientId: cognitoConfig.clientId,
    ChallengeName: "NEW_PASSWORD_REQUIRED",
    Session: session,
    ChallengeResponses: {
      USERNAME: username,
      NEW_PASSWORD: newPassword,
    },
  };

  try {
    const command = new RespondToAuthChallengeCommand(input);
    const response = await cognitoClient.send(command);
    const { AuthenticationResult } = response;

    if (AuthenticationResult) {
      const { IdToken, AccessToken, RefreshToken } = AuthenticationResult;

      if (IdToken && AccessToken && RefreshToken) {
        setAuthDataFromTokens(IdToken, AccessToken, RefreshToken);
      }

      return AuthenticationResult;
    } else {
      throw new Error("Failed to complete password challenge.");
    }
  } catch (error) {
    if (typeof error === "object" && error !== null) {
      const err = error as { name?: string; message?: string; __type?: string };
      const awsErrorCode = err.name || err.__type || "UnknownError";
      const awsMessage = err.message || "Something went wrong.";

      throw new Error(awsMessage);
    }

    throw new Error("An unknown error occurred.");
  }
};

export const getGoogleSigninUrl = () => {
  const google_signin_url =
    `https://${COGNITO_DOMAIN}/oauth2/authorize?` +
    `client_id=${CLIENT_ID}&` +
    `response_type=code&` +
    `scope=openid+email+profile&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `identity_provider=Google`;

  return google_signin_url;
};

export const getMicrosoftSigninUrl = () => {
  const microsoft_signin_url =
    `https://${COGNITO_DOMAIN}/oauth2/authorize?` +
    `client_id=${CLIENT_ID}&` +
    `response_type=code&` +
    `scope=openid+email+profile&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `identity_provider=MicrosoftOIDC`;

  return microsoft_signin_url;
};

export const sendForgotPasswordEmail = async (email: string) => {
  const cmd = new ForgotPasswordCommand({
    ClientId: cognitoConfig.clientId,
    Username: email,
  });

  try {
    const res = await cognitoClient.send(cmd);
    return res;
  } catch (error) {
    if (typeof error === "object" && error !== null) {
      const err = error as { name?: string; message?: string; __type?: string };
      const awsErrorCode = err.name || err.__type || "UnknownError";
      const awsMessage = err.message || "Something went wrong.";

      switch (awsErrorCode) {
        case "UserNotFoundException":
          throw new Error("No account found with that email.");
        case "InvalidParameterException":
          throw new Error("Invalid email address or user not confirmed.");
        case "LimitExceededException":
          throw new Error(
            "Too many attempts. Please wait and try again later."
          );
        default:
          throw new Error(awsMessage);
      }
    }

    throw new Error("An unknown error occurred.");
  }
};

export const confirmForgotPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  const cmd = new ConfirmForgotPasswordCommand({
    ClientId: cognitoConfig.clientId,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword,
  });

  try {
    return await cognitoClient.send(cmd);
  } catch (error) {
    if (typeof error === "object" && error !== null) {
      const err = error as { name?: string; message?: string; __type?: string };
      const awsErrorCode = err.name || err.__type || "UnknownError";
      const awsMessage = err.message || "Something went wrong.";

      switch (awsErrorCode) {
        case "CodeMismatchException":
          throw new Error(
            "The verification code is incorrect. Please try again."
          );
        case "ExpiredCodeException":
          throw new Error(
            "The verification code has expired. Please request a new one."
          );
        case "LimitExceededException":
          throw new Error(
            "Too many attempts. Please wait and try again later."
          );
        default:
          throw new Error(awsMessage);
      }
    }

    throw new Error("An unknown error occurred.");
  }
};
