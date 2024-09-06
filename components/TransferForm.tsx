"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import axios from "axios"
import { ScrollArea } from "./ui/scroll-area"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  accountNumber: z.string().max(11, "Account number must be 11 characters").nonempty("Account number is required"),
  bank: z.string().nonempty("Bank is required"),
  amount: z.string(),
  note: z.string().optional(),
})

const TransferForm = () => {
  const { user } = useUser();
  const users = useQuery(api.accounts.getAccountbyId, { userId: user?.id as string })
  const [banks, setBanks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const accountRef = users?.accountRef;

  useEffect(() => {
    const fetchBalance = async () => {
      if (accountRef) {
        try {
          const response = await axios.get(`/api/flutterwave/fetchBalance`, {
            params: { accountRef }
          });
          setBalance(parseFloat(response.data.data.available_balance));
        } catch (err) {
          setError('Failed to fetch balance');
          toast.error("Failed to fetch balance, please reload the page");
        }
      }
    };

    fetchBalance();
  }, [accountRef]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get('/api/flutterwave/banks');
        setBanks(response.data.data); // Adjust according to actual response structure
      } catch (error) {
        setError('Error fetching banks');
        console.error('Error:', error);
      }
    };

    fetchBanks();
  }, []);

  if (error) return <div>{error}</div>;

  // Define your form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: "",
      bank: "",
      amount: "",
      note: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!balance || balance < values.amount) {
      toast.error('Insufficient balance');
    }  else {
      try {
        setIsLoading(true);
        const response = await axios.post('/api/flutterwave/transfer', {
          account_bank: values.bank,
          account_number: values.accountNumber,
          amount: values.amount,
          narration: values.note,
          reference: `tx-${Date.now()}`, // Unique reference for the transfer
          debit_subaccount: accountRef, // Optional, depending on use case
        });
        toast.success(response.data.message || "Transfer successful");
      } catch (error: any) {
        console.error("Transfer Error:", error);
        toast.error(error.response?.data?.message || "Transfer failed");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="bank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bank" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <ScrollArea className="h-[200px]">
                        {banks.map((bank) => (
                          <SelectItem key={bank.code} value={bank?.code}>{bank.name}</SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 0123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Note</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Use it to spoil yourself" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default TransferForm;
