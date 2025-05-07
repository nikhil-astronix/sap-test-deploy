import { AnimatedContainer } from "@/components/ui/animated-container";
import { Logo } from "@/components/ui/logo";
import Image from "next/image";

// app/auth/layout.tsx
export default function LoginLayout({ children }: { children: React.ReactNode }) {
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
              <AnimatedContainer variant="slide" className="basis-1/2 bg-white px-16 py-12 overflow-y-auto flex items-center justify-center">
                {children}
              </AnimatedContainer>
            </div>
          </AnimatedContainer>
        </body>
      </html>
    );
  }
  