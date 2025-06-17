document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('paymentForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const phoneInput = document.getElementById('phone');
    let phone = phoneInput.value.trim();
    const amount = 99; // Fixed amount

    // Ensure phone number is in format 2547XXXXXXXX
    if (phone.startsWith('0')) {
      phone = '254' + phone.slice(1);
    } else if (phone.startsWith('+254')) {
      phone = phone.replace('+', '');
    } else if (!phone.startsWith('254')) {
      alert('Phone number must start with 07... or 254...');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, amount })
      });

      const data = await response.json();

      if (response.ok) {
        alert('STK Push sent! Check your phone to complete payment of KES 99.');
      } else {
        alert('Payment failed: ' + (data.error || 'Unknown error'));
        console.error(data);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Check your internet or server.');
    }
  });
});
