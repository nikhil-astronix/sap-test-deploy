"use client";

import { AnimatedContainer } from "@/components/ui/animated-container";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IconLoader2 } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getGoogleSigninUrl,
  setAuthDataFromCode,
  signIn,
} from "../utils/auth-functions";
import Link from "next/link";
import { getCurrentUser } from "@/services/userService";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  userType: z.enum(["admin", "observer"]),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams?.get("code");
  const reset = searchParams?.get("reset");

  const [showPassword, setShowPassword] = useState(false);
  const [cognitoError, setCognitoError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [isResetSuccessful, setIsResetSuccessful] = useState(
    reset === "success"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      userType: "admin",
      rememberMe: false,
    },
  });

  useEffect(() => {
    const handleSocialLogin = async () => {
      setCognitoError(null);

      if (!code) return;
      setLoading(true);
      setIsResetSuccessful(false);

      try {
        await setAuthDataFromCode(code);
        setTimeout(() => {
          let role = localStorage.getItem("userRole");
          if (role === "super-admin") {
            router.push("/system-dashboard");
          } else if (role === "admin") {
            router.push("/admin-dashboard");
          } else if (role === "network-dashboard") {
            router.push("/network-dashboard");
          } else {
            router.push("/users");
          }
        }, 2000);
      } catch (err: any) {
        setCognitoError(err.message);
      } finally {
        setLoading(false);
      }
    };

    handleSocialLogin();
  }, [code]);

  const onSubmit = async (data: LoginFormData) => {
    setCognitoError(null);
    setLoading(true);
    setIsResetSuccessful(false);
    const { email, password } = data;

    try {
      const res = await signIn(email, password);

      if (res?.status === "LOGIN_SUCCESS") {
        const response = await getCurrentUser();
        const full_name =
          response.data.first_name + " " + response.data.last_name;
        localStorage.setItem("userrole", response.data.user_type);
        localStorage.setItem("name", full_name);
        let role = response.data.user_type;
        if (role === "Super Admin") {
          router.push("/system-dashboard");
        } else if (role === "Admin") {
          router.push("/admin-dashboard");
        } else if (role === "Network Admin") {
          router.push("/network-dashboard");
        } else {
          router.push("/users");
        }
      } else if (res?.status === "NEW_PASSWORD_REQUIRED") {
        const { userId, session } = res.params;
        // Save cookies with proper options
        document.cookie = `loginStatus=NEW_PASSWORD_REQUIRED; path=/; secure; samesite=lax`;
        document.cookie = `userId=${userId}; path=/; secure; samesite=lax`;
        document.cookie = `session=${session}; path=/; secure; samesite=lax`;
        const userIdEncoded = encodeURIComponent(userId ?? "");
        const sessionEncoded = encodeURIComponent(session ?? "");
        const flowEncoded = encodeURIComponent("SET_NEW_PASSWORD");

        const setNewPasswordUrl = `/auth/reset-password?flow=${flowEncoded}&userId=${userIdEncoded}&session=${sessionEncoded}`;
        router.push(setNewPasswordUrl);
      }
    } catch (err: any) {
      setCognitoError(
        err?.message || "An unexpected error occurred. Try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-96 mx-auto p-6">
      <AnimatedContainer variant="stagger" staggerItems={true}>
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Login to Your Account
        </h2>

        {isResetSuccessful ? (
          <p className="mb-4 text-center text-green-600">
            Password updated successfully
          </p>
        ) : cognitoError !== null ? (
          <p className="text-red-500 mb-8 text-center">{cognitoError}</p>
        ) : (
          <p className="text-gray-600 mb-8 text-center">
            Enter your email and password
          </p>
        )}
      </AnimatedContainer>

      {/* <AnimatedContainer variant="scale" className="mb-8">
        <p className="text-sm font-medium mb-4 text-gray-800 text-left">Select User</p>
        <div className="flex gap-8 justify-start">
          <div className="flex flex-col items-start">
            <button
              onClick={() => setUserType('admin')}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all relative ${
                userType === 'admin'
                  ? 'border-2 border-emerald-600 text-emerald-600 bg-emerald-50'
                  : 'border border-gray-200 text-gray-400'
              }`}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {userType === 'admin' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
            <span className={`mt-2 text-sm font-medium ${
              userType === 'admin' ? 'text-emerald-600' : 'text-gray-400'
            }`}>Admin</span>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => setUserType('observer')}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all relative ${
                userType === 'observer'
                  ? 'border-2 border-emerald-600 text-emerald-600 bg-emerald-50'
                  : 'border border-gray-200 text-gray-400'
              }`}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="currentColor"/>
              </svg>
              {userType === 'observer' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
            <span className={`mt-2 text-sm font-medium ${
              userType === 'observer' ? 'text-emerald-600' : 'text-gray-400'
            }`}>Observer</span>
          </div>
        </div>
      </AnimatedContainer> */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border text-gray-800 border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border text-gray-800 border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-colors pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 10C2.5 10 5 5 10 5C15 5 17.5 10 17.5 10C17.5 10 15 15 10 15C5 15 2.5 10 2.5 10Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4 4L16 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 10C2.5 10 5 5 10 5C15 5 17.5 10 17.5 10C17.5 10 15 15 10 15C5 15 2.5 10 2.5 10Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
            />
            <span className="ml-2 text-sm text-gray-600">Remember Me</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-sm hover:text-emerald-800 font-medium"
          >
            Forgot Password
          </Link>
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center ${
            loading
              ? "bg-emerald-500 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          } text-white`}
          disabled={loading}
        >
          {loading ? (
            <>
              <IconLoader2 className="animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
        <div className="mt-4">
          <Link href={getGoogleSigninUrl()}>
            <button
              type="button"
              className="w-full border border-gray-200 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Image src="/google.svg" alt="Google" width={20} height={20} />
              Sign in with Google
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
