const form = document.getElementById("updateAccountForm")
    form.addEventListener("change", function () {
      const updateBtn = document.getElementById("updateAccountBtn")
      updateBtn.removeAttribute("disabled")
    })