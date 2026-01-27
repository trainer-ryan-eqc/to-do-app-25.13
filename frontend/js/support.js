// --------------------------------- Global Variables ----------------------------------------

const url = "http://localhost:3000";
const form = document.getElementById("contactForm");

const newForm = document.getElementById("newForm");
const successMsg = document.getElementById("success");
const errorMsg = document.getElementById("failed");
const loader = document.getElementById("loader");

// --------------------------------- Event Listeners / Triggers ----------------------------------------

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMail();
});

// ------------------------- Functions to hide/show elements --------------------------------

const disappear = (e) => {
  e.classList.add("d-none");
};

const appear = (e) => {
  e.classList.remove("d-none");
};

// --------------------------------- Functions/APIs ----------------------------------------

async function sendMail() {
  disappear(newForm);
  appear(loader);

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
  };

  try {
    const response = await fetch(`${url}/api/mail/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Network Error! Status: ${response.status}`);
    }

    const data = await response.json();

    disappear(loader);
    appear(successMsg);

    form.reset();

    console.log("Email sent successfully!! 🙌🏼");
  } catch (error) {
    console.error("Error sending mail!", error);

    disappear(loader);
    appear(errorMsg);

    form.reset();
  }
}
