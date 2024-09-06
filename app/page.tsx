'use client'
import { useUser } from '@clerk/nextjs'
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import Settingup from '@/components/Settingup'
import Dashboard from '@/components/Dashboard'
import TransactionsTable from '@/components/TransactionsTable'

const Home = () => {
  const { user, isLoaded } = useUser();
  const users= useQuery(api.accounts.getAccountbyId, { userId: user?.id as string})
  if(!isLoaded) return <h1>Loading...</h1>
  if(!users) return <Settingup />
  
  return (
    <div>
     <Dashboard  />

     <div className="">
      <TransactionsTable accountRef={users?.accountRef}/>
     </div>
    </div>
  )
}

export default Home