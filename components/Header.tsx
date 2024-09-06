'use client'
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react"
import { Copy } from "lucide-react";

const Header = ({ balance }: { balance: number | null })=> {
    const { user, isLoaded } = useUser();
    const formatAsNGN = (amount: number): string => {
        return new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          currencyDisplay: 'symbol',
        }).format(amount);
      };
    const users= useQuery(api.accounts.getAccountbyId, { userId: user?.id as string})
  return (
    <div className='flex items-center justify-center pt-4 flex-col gap-3'>

          <h1 className='text-gray-300 text-lg'>Welcome 
            <span className='text-xl font-bold '> {users?.firstName}
                </span></h1>

                <div className="">

                    <h3 className="text-4xl font-extrabold text-white">
                    {balance !== null ? formatAsNGN(balance) : 'Loading...'}
                        </h3>
                </div>
    </div>
  )
}

export default Header