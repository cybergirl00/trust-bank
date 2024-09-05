import Image from "next/image";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <div className="flex justify-between">

    <div className="">
    <Image 
    src={'/sign-in.jpg'}
    width={300}
    height={300}
    alt='sign in'
    className='h-screen min-h-screen  w-full'
     />
    </div>
     <div className="flex flex-col items-center justify-center">
     {children}
     </div>
   </div>
  );
}
