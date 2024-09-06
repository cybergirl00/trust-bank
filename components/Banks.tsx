// components/Banks.tsx
import axios from 'axios';
import { useEffect, useState } from 'react';

const Banks = () => {
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

  return (
    <div>
      <h1>Banks</h1>
      <ul>
        {banks.map((bank: any) => (
          <li key={bank.id}>{bank.name}</li> // Adjust according to actual bank object structure
        ))}
      </ul>
    </div>
  );
};

export default Banks;
