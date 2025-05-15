'use client';

import { AnimatedContainer } from '@/components/ui/animated-container';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { sendForgotPasswordEmail } from '../utils/auth-functions'; 
import { useState } from 'react';
import { IconLoader2 } from '@tabler/icons-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [cognitoError, setCognitoError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setCognitoError(null);
    setLoading(true);

    try {
      await sendForgotPasswordEmail(data.email);
      
      const flowEncoded = encodeURIComponent('RESET_PASSWORD');
      router.push(`/auth/reset-password?flow=${flowEncoded}&email=${encodeURIComponent(data.email)}`);
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
          Forgot Password
        </h2>

        {
          (cognitoError !== null) 
          ? (
            <p className="text-red-500 mb-8 text-center">
              {cognitoError}
            </p> 
          ) : (
            <p className="text-gray-600 mb-8 text-center">
              Enter your email to reset the password
            </p>
          )
        }
      </AnimatedContainer>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border text-gray-800 border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <button
          type="submit"
          className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center ${loading ? "bg-emerald-500 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"} text-white`}
          disabled={loading}
        >
          {loading ? (
            <>
              <IconLoader2 className='animate-spin mr-2' />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}
