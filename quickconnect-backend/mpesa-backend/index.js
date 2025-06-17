const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// M-PESA credentials (from your Daraja dashboard)
const consumerKey = 'ociTzbSG76MmEj6eo1TKYg8S8HopOM4w7qA7PQmkDHZqednz';
const consumerSecret = '4BRkLYRsj6rvEXhlBX4CK61PZ5iJf75habGquFmshrvVVdCwcRY6LsNGaUnWRIjc';
const businessShortCode = '174379'; // Sandbox PayBill
const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const callbackURL = 'https://mydomain.com/callback'; // Replace with your actual callback URL
// STK Push Route
app.post('/api/stkpush', async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: 'Phone and amount are required.' });
    }

    // Step 1: Generate Access Token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const tokenRes = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const accessToken = tokenRes.data.access_token;

    // Step 2: Prepare STK Push Data
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString('base64');

    const stkPushRequest = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: businessShortCode,
      PhoneNumber: phone,
      CallBackURL: callbackURL,
      AccountReference: 'QuickConnect',
      TransactionDesc: 'Payment for hookup service'
    };

    // Step 3: Send STK Push Request
    const stkRes = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkPushRequest,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Return Safaricom response
    res.status(200).json(stkRes.data);
  } catch (err) {
    console.error('STK Push Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment request failed.' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
