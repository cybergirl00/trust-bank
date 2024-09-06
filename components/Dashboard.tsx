'use client'
import { Copy, PhoneCall, Plus, Send, Signal } from "lucide-react"
import Header from "./Header"
import Navbar from "./Navbar"
import { useEffect, useState } from "react"
import axios from "axios"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const { user, isLoaded } = useUser();
    const users= useQuery(api.accounts.getAccountbyId, { userId: user?.id as string})
    const  accountRef = users?.accountRef;

    useEffect(() => {
        const fetchBalance = async () => {
          try {
            const response = await axios.get(`/api/flutterwave/fetchBalance`, {
              params: { accountRef }
            });
            setBalance(response.data.data.available_balance);
            console.log(response.data.data.available_balance)
          } catch (err) {
            setError('Failed to fetch balance');
          }
        };
    
        fetchBalance();
      }, [accountRef]);



  return (
    <div className='bg-black w-full h-70 rounded-b-xl'>
        <div className="">
        <Navbar />
        </div>


        <div className="">
           <Header balance={balance} />
        </div>

        {/* actions */}

        <div className="flex items-center justify-center pt-4">
          <ul className='flex gap-3'>
            <li className="cursor-pointer flex flex-col gap-2">
                <div className='bg-slate-50 rounded-lg p-2 flex flex-col items-center'>
                <Send color="black" size={22} />
                </div>
                <span className='text-white font-bold text-sm'>Send</span>
            </li>

            <li className="cursor-pointer flex flex-col gap-2 items-center">
                <div className='bg-slate-50 rounded-lg p-2 flex flex-col items-center'>
                <Plus color="black" size={22} />
                </div>
                <span className='text-white font-bold text-sm'>Top up</span>
            </li>

            <li className="cursor-pointer flex flex-col gap-2">
                <div className='bg-slate-50 rounded-lg p-2 flex flex-col items-center'>
                <PhoneCall color="black" size={22} />
                </div>
                <span className='text-white font-bold text-sm'>Airtime</span>
            </li>

            <li className="cursor-pointer flex flex-col gap-2">
                <div className='bg-slate-50 rounded-lg p-2 flex flex-col items-center'>
                <Signal color="black" size={22} />
                </div>
                <span className='text-white font-bold text-sm'>Data</span>
            </li>
          </ul>
        </div>

        {/* <div className="shadow-lg rounded-xl bg-white  flex gap-4 items-center  justify-center p-5">
            <div className="">
            <h1>{users?.accountNumber}</h1>
            <span className='text-sm font-light'>{users?.bankName}</span>
            </div>
            <Copy className='cursor-pointer'/>
        </div> */}
    </div>
  )
}

export default Dashboard