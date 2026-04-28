// contact form

emailjs.init({ publicKey: import.meta.env.EMAILJS_PUBLIC_KEY });

const form = document.getElementById("contact-form");
const submitButton = document.getElementById("button-form");
const confirmationMsg = document.getElementById("form-message");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  confirmationMsg.textContent = "";
  confirmationMsg.className = "form-message";
  submitButton.disabled = true;
  submitButton.value = "Sending...";

  emailjs
    .sendForm(
      import.meta.env.EMAILJS_SERVICE_ID,
      import.meta.env.EMAILJS_TEMPLATE_ID,
      this,
    )
    .then(() => {
      confirmationMsg.textContent = "Message sent successfully!";
      confirmationMsg.className = "form-message success";
      this.reset();
      submitButton.disabled = false;
      submitButton.value = "Submit";
    })
    .catch((error) => {
      confirmationMsg.textContent = "Failed to send message: " + error.text;
      confirmationMsg.className = "form-message error";
      submitButton.disabled = false;
      submitButton.value = "Submit";
    });
});
