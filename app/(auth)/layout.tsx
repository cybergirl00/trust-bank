import Image from "next/image";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Left Image Section */}
      <div className="relative w-1/2 hidden md:block">
        <Image 
          src="/sign-in.jpg"
          layout="fill"
          objectFit="cover"
          alt="Sign In"
          className="h-full w-full"
        />
      </div>

      {/* Right Content Section */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 md:px-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
