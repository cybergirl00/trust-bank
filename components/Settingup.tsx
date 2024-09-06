import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toast } from "sonner";

const formSchema = z.object({
  phone: z.string().regex(/^\d+$/, "Phone number should be digits only"),
  firstname: z.string(),
  lastname: z.string(),
  fullname: z.string() 
});

const Settingup = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const createAccount = useMutation(api.accounts.createAccount);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      firstname: "",
      lastname: "",
      fullname: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/flutterwave/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.emailAddresses[0].emailAddress,
          mobilenumber: values.phone,
          account_name: values.fullname
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Network response was not ok: ${errorDetails}`);
      }

      const data = await response.json();
      console.log(data);

      await createAccount({
        holderName: values.fullname,
        email: user?.emailAddresses[0].emailAddress ?? '',
        firstName: values.firstname,
        lastName: values.lastname ?? '',
        phoneNumber: values.phone,
        accountNumber: data?.data?.nuban ?? '',
        bankName: data?.data?.bank_name ?? '',
        userId: user?.id ?? '',
        username: user?.username ?? '',
        accountRef: data?.data?.account_reference
      });

      setIsLoading(false);
      router.refresh();
      toast("Congratulations!!, Your account has been created successfully.");
    } catch (error) {
      console.error('Error creating account:', error);
      toast("Oops! Error creating an account.");
      setIsLoading(false);
    }
  };

  // Wrap the asynchronous `onSubmit` in a synchronous function to satisfy the expected `void` return
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Finish Setting Up Your Account</h1>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your first Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
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
    </div>
  );
};

export default Settingup;
