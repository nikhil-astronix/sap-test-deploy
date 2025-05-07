'use client';

import { AnimatedContainer } from '@/components/ui/animated-container';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { completeNewPassword } from '../utils/auth-functions';

const resetPasswordSchema = z
.object({
  // oldPassword: z.string(),
  newPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must include at least 1 uppercase letter, 1 number, and 1 special character'
    ),
  confirmNewPassword: z.string(),
})
.refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});
// .refine((data) => data.oldPassword !== data.newPassword, {
//   message: 'New password must be different from old password',
//   path: ['newPassword'],
// });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const flow = searchParams?.get("flow");

  // const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetPasswordFlow, setResetPasswordFlow] = useState(flow);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (resetPasswordFlow === "SET_NEW_PASSWORD") {
      const userId = searchParams?.get("userId");
      const session = searchParams?.get("session");
      if(typeof userId === 'string' && typeof session === 'string') {
        completeNewPassword(userId, data.confirmNewPassword, session)
          .then(() => router.push('/observations'));
      }
    }
  };

  return (
    <div className="w-xl mx-auto shadow-xl rounded-xl p-6">
      <AnimatedContainer variant="stagger" staggerItems={true}>
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          {
            (resetPasswordFlow === "SET_NEW_PASSWORD")
              ? "Set New Password"
              : "Reset Password"
          }
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Enter your new password to reset the password
        </p>
      </AnimatedContainer>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Old Password
          </label>
          <div className="relative">
            <input
              {...register('oldPassword')}
              type={showOldPassword ? 'text' : 'password'}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border text-gray-800 border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-colors pr-10"
              placeholder="Enter old password"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showOldPassword ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 10C2.5 10 5 5 10 5C15 5 17.5 10 17.5 10C17.5 10 15 15 10 15C5 15 2.5 10 2.5 10Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 4L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 10C2.5 10 5 5 10 5C15 5 17.5 10 17.5 10C17.5 10 15 15 10 15C5 15 2.5 10 2.5 10Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              )}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</p>
          )}
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              {...register('newPassword')}
              type={showNewPassword ? 'text' : 'password'}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border text-gray-800 border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-colors pr-10"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNewPassword ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 10C2.5 10 5 5 10 5C15 5 17.5 10 17.5 10C17.5 10 15 15 10 15C5 15 2.5 10 2.5 10Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 4L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 10C2.5 10 5 5 10 5C15 5 17.5 10 17.5 10C17.5 10 15 15 10 15C5 15 2.5 10 2.5 10Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            {...register('confirmNewPassword')}
            type='password'
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border text-gray-800 border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
            placeholder="Confirm new password"
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};
