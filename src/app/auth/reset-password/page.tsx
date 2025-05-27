"use client";

import React, { useState } from "react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  completeNewPassword,
  confirmForgotPassword,
} from "../utils/auth-functions";
import { useRouter, useSearchParams } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const flow = searchParams?.get("flow");
  const email = searchParams?.get("email");
  const isSetNewPw = flow === "SET_NEW_PASSWORD";

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [cognitoError, setCognitoError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const resetPasswordSchema = z
    .object({
      code: isSetNewPw
        ? z.string().optional()
        : z
            .string()
            .length(6, "Verification code must be exactly 6 characters"),
      newPassword: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
          "Password must include at least 1 uppercase letter, 1 number, and 1 special character"
        ),
      confirmNewPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmNewPassword, {
      message: "Passwords do not match",
      path: ["confirmNewPassword"],
    });

  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      if (isSetNewPw) {
        const userId = searchParams?.get("userId");
        const session = searchParams?.get("session");

        if (userId && session) {
          await completeNewPassword(userId, data.confirmNewPassword, session);
          // Clear cookies after password reset
          document.cookie =
            "loginStatus=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          document.cookie =
            "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          document.cookie =
            "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          router.push("/observations");
        }
      } else {
        await confirmForgotPassword(
          email as string,
          data.code as string,
          data.confirmNewPassword
        );

        router.push("/auth/login?reset=success");
      }
    } catch (err: any) {
      setCognitoError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-xl mx-auto shadow-xl rounded-xl p-6">
      <AnimatedContainer variant="stagger" staggerItems={true}>
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          {isSetNewPw ? "Set New Password" : "Reset Password"}
        </h2>

        {cognitoError !== null ? (
          <p className="text-red-500 mb-8 text-center">{cognitoError}</p>
        ) : (
          <p className="text-gray-600 mb-8 text-center">
            Enter your new password to reset the password
          </p>
        )}
      </AnimatedContainer>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {!isSetNewPw && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              {...register("code")}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border text-gray-800 border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
              placeholder="Enter the 6-digit code"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              {...register("newPassword")}
              type={showNewPassword ? "text" : "password"}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border text-gray-800 border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-colors pr-10"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNewPassword ? (
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
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            {...register("confirmNewPassword")}
            type="password"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border text-gray-800 border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
            placeholder="Confirm new password"
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmNewPassword.message}
            </p>
          )}
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
              {isSetNewPw ? "Submitting..." : "Resetting..."}
            </>
          ) : isSetNewPw ? (
            "Set New Password"
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
}
