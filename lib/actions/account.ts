import axios from 'axios'

interface CreateVirtualProps {
    holderName: string,
    email: string,
    bvn: string,
    phoneNumber: string,
    firstName: string,
    lastName: string,
    username: string
}

interface BalanceProps {
  accountRef: string
}
export const createVirtualAccount = async ( { holderName, email, bvn, phoneNumber, firstName, lastName, username} : CreateVirtualProps
) => {
var data = JSON.stringify({
  "email": email,
  "is_permanent": true,
  "bvn" :bvn,
  "tx_ref": "YOUR_REFERENCE",
  "phonenumber": phoneNumber,
  "firstname": firstName,
  "lastname": lastName,
  "narration": username
});

var config = {
  method: 'post',
  url: 'https://api.flutterwave.com/v3/virtual-account-numbers',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
  },
  data : data
};

axios(config)
.then((response) => {
    console.log(response)
})
.catch((error) => {
    console.error(error)
})

}


export const getBalances = async ({ accountRef }: BalanceProps) => {
  try {
    // Make an API call to fetch the balance using the account reference
    const response = await axios.get(
      `https://api.flutterwave.com/v3/payout-subaccounts/${accountRef}/balance`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`, // Ensure your secret key is in .env
          "Content-Type": "application/json",
        },
      }
    );

    // Return the response data if the request was successful
    return response.data;
  } catch (error: any) {
    // Log and throw a more specific error message for easier debugging
    console.error("Error fetching balances:", error.response?.data || error.message);
    throw new Error("Failed to fetch balance. Please try again.");
  }
};