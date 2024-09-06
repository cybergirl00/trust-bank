'use client';

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Settingup from '@/components/Settingup';
import Dashboard from '@/components/Dashboard';
import TransactionsTable from '@/components/TransactionsTable';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Home = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const userId = user?.id as string;
  const users = useQuery(api.accounts.getAccountbyId, { userId });

  useEffect(() => {
    if (isLoaded && !user) {
      // If user is not logged in, redirect to the sign-in page
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) return <h1>Loading...</h1>;

  if (user && !users) {
    // If user is logged in but no account data, show the Settingup component
    return <Settingup />;
  }

  return (
    <>
    <SignedIn>
    <div>
      <Dashboard />
      <div>
        <TransactionsTable accountRef={users?.accountRef} />
      </div>
    </div>
    </SignedIn>

    <SignedOut>
      <SignInButton>Sign in</SignInButton>
    </SignedOut>
    </>
  );
};

export default Home;
