'use client'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useQuery } from "convex/react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const TransactionsTable = ({ accountRef }: { accountRef: string }) => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchTransactions = async () => {
        try {
          const response = await axios.get(`/api/flutterwave/fetchTransactions`, {
            params: { accountRef }
          });
          setTransactions(response.data.data.transactions); // Adjust based on the actual API response structure
        } catch (err) {
          console.error('Fetch transactions error:', err);
          setError('Failed to fetch transactions');
        }
      };
  
      fetchTransactions();
    }, [accountRef]);
  
    if (error) return <div>Error: {error}</div>;
  
    return (
      <div className="p-6">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Recent Transactions</h2>
        </div>
  
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>A list of your recent transactions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Action</TableHead>
                <TableHead className="text-left">Description</TableHead>
                <TableHead className="text-left">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction: any) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className={`p-2 rounded-full flex items-center justify-center ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.type === 'C' ? <ArrowUp color='green' size={20} /> : <ArrowDown color='red' size={20} />}
                    </div>
                  </TableCell>
                  <TableCell>{transaction.remarks}</TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell
                   className={`text-right
                    ${transaction.type === 'C' ?  'text-green-600' : 'text-red-600'}
                      font-semibold`}
                   >
                    {transaction.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };
  
  export default TransactionsTable;