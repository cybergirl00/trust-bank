'use client'
import { Copy,  Plus, Send,  } from "lucide-react"
import Header from "./Header"
import Navbar from "./Navbar"
import { useEffect, useState } from "react"
import axios from "axios"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import TransferForm from "./TransferForm"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"



const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const { user, isLoaded } = useUser();
    const users= useQuery(api.accounts.getAccountbyId, { userId: user?.id as string})
    const  accountRef = users?.accountRef;
    const accountNumber = users?.accountNumber;

    // copy account number 
    const handleCopy = async () => {
      if (accountNumber) {  // Ensure accountNumber is defined
        try {
          await navigator.clipboard.writeText(accountNumber);
          toast.success("Account number copied to clipboard!"); // Show success message
        } catch (err) {
          console.error("Failed to copy: ", err);
          toast.error("Failed to copy the account number"); // Show error message
        }
      } else {
        toast.error("Account number is not available"); // Handle undefined account number
      }
    };

    useEffect(() => {
        const fetchBalance = async () => {
          try {
            const response = await axios.get(`/api/flutterwave/fetchBalance`, {
              params: { accountRef }
            });
            setBalance(response.data.data.available_balance);

          } catch (err) {
            setError('Failed to fetch balance');
            toast("Failer to fetch balance please reload the page")

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

            <Dialog>
  <DialogTrigger>
    
  <div className='bg-slate-50 rounded-lg p-2 flex flex-col items-center'>
                <Send color="black" size={22} />
                </div>
                <span className='text-white font-bold text-sm'>Send</span>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Transfer funds</DialogTitle>
    </DialogHeader>
    <TransferForm />
  </DialogContent>
</Dialog>
            </li>

            <li className="cursor-pointer flex flex-col gap-2 items-center">
            <Dialog>
      <DialogTrigger>
      <div className='bg-slate-50 rounded-lg p-2 flex flex-col items-center'>
                <Plus color="black" size={22} />
                </div>
                <span className='text-white font-bold text-sm'>Top up</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
          <DialogDescription>
            Copy account details to make transfer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="accountNumber" className="sr-only">
              Account Number
            </Label>
            <Input
              id="accountNumber"
              defaultValue={users?.accountNumber}
              readOnly
            />
          </div>
          <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <h1>Bank Name: {users?.bankName}</h1>
      </DialogContent>
    </Dialog>
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