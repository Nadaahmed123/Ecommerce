document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading');
  const authContainer = document.querySelector('.auth-container');

  setTimeout(() => {
    loadingScreen.style.display = 'none';
    authContainer.style.display = 'block';
  }, 1500);

  if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.replace('home.html');
    return;
  }

  const signUpLink = document.getElementById('sign-up');
  const signInLink = document.getElementById('sign-in');
  const loginForm = document.getElementById('login-in');
  const signupForm = document.getElementById('login-up');
  const toggleLoginPassword = document.getElementById('toggle-login-password');
  const toggleSignupPassword = document.getElementById('toggle-signup-password');
  function setupPasswordToggle(toggle, inputId) {
    toggle.addEventListener('click', () => {
      const input = document.getElementById(inputId);
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      toggle.classList.toggle('fa-eye');
      toggle.classList.toggle('fa-eye-slash');
    });
  }

  setupPasswordToggle(toggleLoginPassword, 'login-password');
  setupPasswordToggle(toggleSignupPassword, 'signup-password');

  signUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    signupForm.classList.add('animate-in');
    clearErrors();
  });

  signInLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    loginForm.classList.add('animate-in');
    clearErrors();
  });

  function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
    document.querySelectorAll('.form-message').forEach(el => {
      el.style.display = 'none';
    });
  }

  function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
    }
  }

  function showFormError(message) {
    const element = document.getElementById('login-error') || document.getElementById('signup-error');
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
    }
  }

  function showFormSuccess(message) {
    const element = document.getElementById('signup-success');
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  }

  function validateUsername(username) {
    const re = /^[a-zA-Z0-9_]{3,20}$/;
    return re.test(username);
  }

  function loadUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Form validation setup
  document.getElementById('signup-username')?.addEventListener('blur', function() {
    if (!validateUsername(this.value.trim())) {
      showError('signup-username-error', 'Username must be 3-20 characters (letters, numbers, underscores)');
    } else {
      showError('signup-username-error', '');
    }
  });

  document.getElementById('signup-email')?.addEventListener('blur', function() {
    if (!validateEmail(this.value.trim())) {
      showError('signup-email-error', 'Please enter a valid email address');
    } else {
      showError('signup-email-error', '');
    }
  });

  document.getElementById('signup-password')?.addEventListener('blur', function() {
    if (!validatePassword(this.value)) {
      showError('signup-password-error', 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
    } else {
      showError('signup-password-error', '');
    }
  });

  document.getElementById('signup-password-confirm')?.addEventListener('blur', function() {
    const password = document.getElementById('signup-password').value;
    if (this.value !== password) {
      showError('signup-confirm-error', 'Passwords do not match');
    } else {
      showError('signup-confirm-error', '');
    }
  });

  // Signup form submission
  document.getElementById('signup-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    clearErrors();
    
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-password-confirm').value;

    let isValid = true;
    
    if (!username) {
      showError('signup-username-error', 'Username is required');
      isValid = false;
    } else if (!validateUsername(username)) {
      showError('signup-username-error', 'Invalid username format');
      isValid = false;
    }
    
    if (!email) {
      showError('signup-email-error', 'Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      showError('signup-email-error', 'Invalid email format');
      isValid = false;
    }
    
    if (!password) {
      showError('signup-password-error', 'Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      showError('signup-password-error', 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
      isValid = false;
    }
    
    if (!confirmPassword) {
      showError('signup-confirm-error', 'Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      showError('signup-confirm-error', 'Passwords do not match');
      isValid = false;
    }
    
    if (!isValid) return;

    const users = loadUsers();
    
    const usernameExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    const emailExists = users.some(u => u.email === email);
    
    if (usernameExists) {
      showError('signup-username-error', 'Username already taken');
      return;
    }

    if (emailExists) {
      showError('signup-email-error', 'Email already registered');
      return;
    }

    const newUser = { 
      username, 
      email, 
      password,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    showFormSuccess('Account created successfully! Redirecting...');
   
    setTimeout(() => {
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('isLoggedIn', 'true');
      window.location.replace('home.html');
    }, 1500);
  });


  document.getElementById('login-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    clearErrors();
    
    const emailOrUsername = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    let isValid = true;
    
    if (!emailOrUsername) {
      showError('login-username-error', 'Email or username is required');
      isValid = false;
    }
    
    if (!password) {
      showError('login-password-error', 'Password is required');
      isValid = false;
    }
    
    if (!isValid) return;

    const users = loadUsers();
    
    const user = users.find(u =>
      (u.email === emailOrUsername.toLowerCase() || 
       u.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
      u.password === password
    );
    
    if (!user) {
      showFormError('Invalid , Please try again.');
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    
    if (rememberMe) {
      
      localStorage.setItem('rememberMe', 'true');
    }
    
    window.location.replace('home.html');
  });
});
