// contact form

emailjs.init({ publicKey: "zP79waPTeK76qUyK3" });

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
    .sendForm("service_r9tfhhu", "template_r5bfleo", this)
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
