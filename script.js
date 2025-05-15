 // Check if credentials exist in localStorage and populate the fields
    document.addEventListener('DOMContentLoaded', function() {
      const savedUsername = localStorage.getItem('wifiUsername');
      const savedPassword = localStorage.getItem('wifiPassword');
      
      if (savedUsername && savedPassword) {
        document.getElementById('username').value = savedUsername;
        document.getElementById('password').value = savedPassword;
        document.getElementById('rememberMe').checked = true;
      }
    });

    function login() {
      const messageEl = document.getElementById("message");
      messageEl.textContent = "";
      messageEl.className = "";
      
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const rememberMe = document.getElementById("rememberMe").checked;

      if (!username || !password) {
        messageEl.textContent = "⚠️ Please enter both username and password.";
        messageEl.classList.add("warning");
        return;
      }

      // Save credentials if "Remember me" is checked
      if (rememberMe) {
        localStorage.setItem('wifiUsername', username);
        localStorage.setItem('wifiPassword', password);
      } else {
        localStorage.removeItem('wifiUsername');
        localStorage.removeItem('wifiPassword');
      }

      // Show loading state
      const btn = document.querySelector("button");
      const btnText = btn.textContent;
      btn.innerHTML = `<span class="loading"></span> Connecting...`;
      btn.disabled = true;

      sendLoginRequest(username, password)
        .finally(() => {
          btn.textContent = btnText;
          btn.disabled = false;
        });
    }
    
    function autoLogin() {
      const messageEl = document.getElementById("message");
      messageEl.textContent = "";
      messageEl.className = "";
      
      const savedUsername = localStorage.getItem('wifiUsername');
      const savedPassword = localStorage.getItem('wifiPassword');
      
      if (!savedUsername || !savedPassword) {
        messageEl.textContent = "⚠️ No saved credentials found.";
        messageEl.classList.add("warning");
        return;
      }
      
      // Populate fields (optional)
      document.getElementById('username').value = savedUsername;
      document.getElementById('password').value = savedPassword;
      
      // Show loading state
      const btn = document.getElementById("autoLoginBtn");
      const btnText = btn.textContent;
      btn.innerHTML = `<span class="loading"></span> Auto Connecting...`;
      btn.disabled = true;
      
      sendLoginRequest(savedUsername, savedPassword)
        .finally(() => {
          btn.textContent = btnText;
          btn.disabled = false;
        });
    }
    
    function sendLoginRequest(username, password) {
      const messageEl = document.getElementById("message");
      
      return fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        messageEl.textContent = data.message;
        if (data.status === 'success') {
          messageEl.classList.add("success");
        } else {
          messageEl.classList.add("error");
        }
      })
      .catch(error => {
        messageEl.textContent = "❌ Connection error. Please try again.";
        messageEl.classList.add("error");
        console.error("Error:", error);
      });
    }