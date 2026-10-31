// Open the Modal
function openModal(type) {
    document.getElementById('authModal').classList.add('active');
    switchModal(type);
}

// Switch between Login and Register forms
function switchModal(type) {
    if (type === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
    } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    }
}

// Close the Modal
function closeModal() {
    document.getElementById('authModal').classList.remove('active');
}

// Handle Registration
async function handleRegister() {
    const name = document.getElementById('regName').value;
    const country = document.getElementById('regCountry').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    if (!name || !country || !email || !password) {
        return alert("Please fill in all fields.");
    }

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, country, email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            alert("Registration successful! Please log in.");
            switchModal('login');
        } else {
            alert(data.message || "Registration failed.");
        }
    } catch (error) {
        alert("Error connecting to server.");
    }
}

// Handle Login
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        return alert("Please fill in all fields.");
    }

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            alert("Login successful! Welcome " + data.user.name);
            localStorage.setItem('token', data.token); // Save user session
            localStorage.setItem('user', JSON.stringify(data.user));
            closeModal();
        } else {
            alert(data.message || "Login failed.");
        }
    } catch (error) {
        alert("Error connecting to server.");
    }
}
