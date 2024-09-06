// lib/actions/banks.ts
import axios from 'axios';

export const fetchBanks = async () => {
  try {
    const response = await axios.get('/api/flutterwave/banks');
    return response.data;
  } catch (error) {
    console.error('Error fetching banks:', error);
    throw error;
  }
};
