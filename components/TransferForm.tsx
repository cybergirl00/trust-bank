"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl,FormDescription,FormField, FormItem,  FormLabel,FormMessage,} from "@/components/ui/form"
import { Select, SelectContent, SelectGroup, SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Banks from "./Banks"
import { useEffect, useState } from "react"
import axios from "axios"
import { ScrollArea } from "./ui/scroll-area"
const formSchema = z.object({
  accountNumber: z.string().max(11),
  bank: z.string(),
  amount: z.string(),
  note: z.string(),
})

const TransferForm = () => {
  const [banks, setBanks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        accountNumber: "",
        bank: "",
        amount: "",
        note: "",
      },
    })
   
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values)
    }
  return (
    <div>
      <div className="">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

      <FormField
          control={form.control}
          name="bank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Account</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                <SelectGroup>
                <ScrollArea className="h-[200px]">
                  {banks.map((bank) => (
                    <SelectItem value={bank?.code}>{bank.name}</SelectItem>
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
                <Input placeholder="eg 0123456789" {...field} />
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
              <FormLabel>Enter Amount</FormLabel>
              <FormControl>
                <Input placeholder="Amount" {...field} />
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
                <Input placeholder="e.g: Use it to spoil yourself" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Form>
      </div>
    </div>
  )
}

export default TransferForm