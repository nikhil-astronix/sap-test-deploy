"use client";

import { AnimatedContainer } from "@/components/ui/animated-container";
import { Logo } from "@/components/ui/logo";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

// app/auth/layout.tsx
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginRoute = pathname?.startsWith('/auth/login');

  return (
    <html lang="en">
      <body>
        <AnimatedContainer variant="slide" className="h-screen flex items-stretch bg-white p-3">
          <div className="w-full flex flex-nowrap rounded-xl">
            {/* Left Side - Hero Image */}
            <AnimatedContainer variant="fade" className="basis-1/2 rounded-xl relative bg-gradient-to-br from-black via-black to-emerald-800 px-6 py-4 text-white flex flex-col">
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
    
            {/* Right Side */}
            <AnimatedContainer variant="slide" className="basis-1/2 bg-white px-16 py-2 overflow-y-auto flex flex-col items-center justify-center">
              {
                (!isLoginRoute) &&
                <AnimatedContainer variant="fade" className="w-full flex justify-start">
                  <div className="w-full">
                    <button
                      onClick={() => router.push('/auth/login')}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-black hover:bg-gray-200 transition"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#000000"/>
                      </svg>
                      <span className="font-medium text-sm">
                        Back to Login
                      </span>
                    </button>
                  </div>
                </AnimatedContainer>
              }
              
              <div className="grow flex justify-center items-center">
                {children}
              </div>
            </AnimatedContainer>
          </div>
        </AnimatedContainer>
      </body>
    </html>
  );
};
