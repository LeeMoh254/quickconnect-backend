async function submitDetails(event) {
  event.preventDefault();

  // Get values from the form
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const idNumber = document.getElementById("idNumber").value.trim();
  const age = document.getElementById("age").value.trim();
  const phone = document.getElementById("phoneNumber").value.trim();
  const hookupType = document.getElementById("hookupType").value;
  const selfie = document.getElementById("selfie").files[0];

  // Basic validations
  if (!phone.startsWith("254")) {
    alert("Phone number must start with 254.");
    return;
  }

  if (!firstName || !lastName || !idNumber || !age || !hookupType || !selfie) {
    alert("Please fill in all fields.");
    return;
  }

  // Send STK push request to backend
  try {
    const response = await fetch("http://localhost:3000/api/stkpush", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phone,
        amount: 99,
        firstName,
        lastName,
        idNumber,
        age,
      }),
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Server error: " + errorText);
    }

    if (!contentType.includes("application/json")) {
      throw new Error("Unexpected response format.");
    }

    const data = await response.json();

    // Show success message
    document.body.innerHTML = `
      <div style="text-align: center; font-family: Arial, sans-serif; padding: 40px;">
        <h2 style="color: green;">Thank you!</h2>
        <p>Your details have been received.</p>
        <p>Hang tight, we will contact you shortly and match you up.</p>
        <button onclick="location.reload()" style="
          margin-top: 20px;
          background-color: #ff4081;
          color: white;
          border: none;
          padding: 12px 20px;
          font-size: 1rem;
          border-radius: 5px;
          cursor: pointer;
        ">Start Over</button>
      </div>
    `;
  } catch (error) {
    console.error(error);
    document.body.innerHTML = `
      <div style="text-align: center; font-family: Arial, sans-serif; padding: 40px;">
        <h2 style="color: red;">Oops!</h2>
        <p>Something went wrong while sending your payment request.</p>
        <p>Please try again in a few seconds.</p>
        <button onclick="location.reload()" style="
          margin-top: 20px;
          background-color: #e03570;
          color: white;
          border: none;
          padding: 12px 20px;
          font-size: 1rem;
          border-radius: 5px;
          cursor: pointer;
        ">Try Again</button>
      </div>
    `;
  }
}