// --------------------------------- Global Variables ----------------------------------------

const url = "http://localhost:3000";
const form = document.getElementById("contactForm");


// --------------------------------- Event Listeners / Triggers ----------------------------------------

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMail();
});




// --------------------------------- Functions/APIs ----------------------------------------

async function sendMail() {

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim()
  }

  try {
    const response = await fetch(`${url}/api/mail/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error(`Network Error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log("Email sent successfully!! 🙌🏼");

  } catch (error) {
    console.error("Error sending mail!", error);
  }
}