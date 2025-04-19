'use client';

import { AnimatedContainer } from '@/components/ui/animated-container';
import { Logo } from '@/components/ui/logo';
import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  userType: z.enum(['admin', 'observer']),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'admin' | 'observer'>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userType: 'admin',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log(data);
    // TODO: Add actual authentication logic here
    // For now, we'll just redirect
    router.push('/observations');
  };

  return (
    <AnimatedContainer variant="slide" className="h-screen flex items-stretch bg-white p-3">
      <div className="w-full flex rounded-xl">
        {/* Left Side - Hero Image */}
        <AnimatedContainer variant="fade" className="rounded-xl relative w-1/2 bg-gradient-to-br from-black via-black  to-emerald-800 px-6 py-4 text-white flex flex-col">
          <div className="relative z-10 flex flex-col h-full rounded-xl">
            <div>
              <Logo className="text-white mb-8" height={40} />
            </div>
            
            <div className="mt-auto mb-1">
              <AnimatedContainer variant="stagger" staggerItems={true}>
                <h1 className="text-5xl font-serif mb-6">
                  Lorem<br />
                  Ipsum dolor<br />
                  sit amet
                </h1>
                <p className="text-gray-300 text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed<br />
                  do eiusmod tempor incididunt ut labore
                </p>
              </AnimatedContainer>
            </div>
          </div>
          {/* Background waves overlay */}
          <div className="absolute inset-0 z-0 rounded-xl overflow-hidden">
            <Image
              src="/silk-wave.jpg"
              alt="Background Pattern"
              fill
              style={{ objectFit: 'cover', opacity: 0.2 }}
              priority
              className="rounded-xl"
            />
            <div className="absolute  " />
          </div>
        </AnimatedContainer>

        {/* Right Side - Login Form */}
        <AnimatedContainer variant="slide" className="w-1/2 bg-white px-16 py-12 overflow-y-auto flex items-center justify-center">
          <div className="w-xl mx-auto shadow-xl rounded-xl p-6">
            <AnimatedContainer variant="stagger" staggerItems={true}>
              <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Login to Your Account</h2>
              <p className="text-gray-600 mb-8 text-center">
                Enter your email and password to access your account
              </p>
            </AnimatedContainer>

            <AnimatedContainer variant="scale" className="mb-8">
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
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border text-gray-800 border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-colors pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
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
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember Me</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Sign In
              </button>

              <button
                type="button"
                className="w-full border border-gray-200 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Image
                  src="/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                />
                Sign in with Google
              </button>
            </form>
          </div>
        </AnimatedContainer>
      </div>
    </AnimatedContainer>
  );
} 