// Show the password in the login form
function showPassword() {
    const showPassButton = document.querySelector(".show-password-button");
  
    showPassButton.addEventListener("click", function() {
      const passwordField = document.getElementById("password");
      if (passwordField.type === "password") {
        passwordField.type = "text";
        showPassButton.textContent = "Hide Password"
      } else {
        passwordField.type = "password";
        showPassButton.textContent = "Show Password"
      }
    })
  }

showPassword()