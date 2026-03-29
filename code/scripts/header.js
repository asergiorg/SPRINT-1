async function loadAndOpenModal(fileUrl, modalId) {
  let modal = document.getElementById(modalId);

  if (!modal) {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("No se pudo cargar el archivo: " + fileUrl);

      const htmlSnippet = await response.text();

      document.body.insertAdjacentHTML("beforeend", htmlSnippet);

      modal = document.getElementById(modalId);
      modal.style.display = "flex";

    } catch (error) {
      console.error("Error al cargar el modal " + modalId + ": ", error);
    }
  } else {
    modal.style.display = "flex";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

window.onclick = function(event) {
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");

  if (loginModal && event.target === loginModal) {
    closeModal("loginModal");
  } else if (signupModal && event.target === signupModal) {
    closeModal("signupModal");
  }
}

document.addEventListener("contentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const sideMenu = document.getElementById("side-menu");
    const overlay = document.getElementById("overlay");

    if (!hamburger) return; // Evita errores si aún no está cargado

    hamburger.addEventListener("click", () => {
        sideMenu.classList.toggle("show");
        overlay.classList.toggle("show");
    });

    overlay.addEventListener("click", () => {
        sideMenu.classList.remove("show");
        overlay.classList.remove("show");
    });
});


function updateAuthUI() {
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    
    if (window.location.pathname.includes('user-activities.html') && !currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const authContainer = document.querySelector('.auth-buttons');
    const btnSignup = document.querySelector('.auth-buttons .btn-primary.normal');
    const btnLogin = document.querySelector('.auth-buttons .btn-secondary.normal');
    const btnLoginReduce = document.getElementById('login-reduce');
    const btnLogout = document.querySelector('.auth-buttons .btn-danger.normal');
    const btnLogoutReduce = document.getElementById('logout-reduce');
    
    const myActivitiesLinks = document.querySelectorAll('.user-activities');

    if (!btnSignup && myActivitiesLinks.length === 0) return;

    const reviewUserNameDisplay = document.querySelector(".review-item .avatar h3");
    if (reviewUserNameDisplay) {
        reviewUserNameDisplay.textContent = currentUser ? currentUser : "Inicia sesión para comentar";
    }

    let greetingElement = document.getElementById('user-greeting');
    if (!greetingElement && authContainer) {
        greetingElement = document.createElement('span');
        greetingElement.id = 'user-greeting';
        greetingElement.style.marginRight = '15px'; 
        greetingElement.style.fontWeight = 'bold';
        if (btnLogout) {
            authContainer.insertBefore(greetingElement, btnLogout);
        } else {
            authContainer.appendChild(greetingElement);
        }
    }

    if (currentUser) {
        if (btnSignup) btnSignup.style.display = 'none';
        if (btnLogin) btnLogin.style.display = 'none';
        if (btnLoginReduce) btnLoginReduce.style.display = 'none';
        if (btnLogout) btnLogout.style.display = ''; 
        if (btnLogoutReduce) btnLogoutReduce.style.display = '';
        
        if (greetingElement) {
            greetingElement.textContent = `Hola, ${currentUser}`;
            greetingElement.style.display = 'inline-block';
        }

        myActivitiesLinks.forEach(link => {
            if (link.parentElement && link.parentElement.tagName === 'LI') {
                link.parentElement.style.display = '';
            } else {
                link.style.display = '';
            }
        });

    } else {
        if (btnSignup) btnSignup.style.display = '';
        if (btnLogin) btnLogin.style.display = '';
        if (btnLoginReduce) btnLoginReduce.style.display = '';
        if (btnLogout) btnLogout.style.display = 'none';
        if (btnLogoutReduce) btnLogoutReduce.style.display = 'none';

        if (greetingElement) {
            greetingElement.style.display = 'none';
        }
        
        myActivitiesLinks.forEach(link => {
            if (link.parentElement && link.parentElement.tagName === 'LI') {
                link.parentElement.style.display = 'none';
            } else {
                link.style.display = 'none';
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", updateAuthUI);
document.addEventListener("contentLoaded", updateAuthUI);

document.addEventListener('submit', function(event) {
    
    if (event.target.closest('#signupModal form')) {
        event.preventDefault();
        const form = event.target;
        const username = form.username.value;
        const password = form.password.value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.find(u => u.username === username)) {
            alert('Este nombre de usuario ya está registrado. Por favor, elige otro.');
            return;
        }

        users.push({ username: username, password: password });
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('¡Registro exitoso! Ya puedes iniciar sesión.');
        closeModal('signupModal');
        loadAndOpenModal('login-modal.html', 'loginModal');
    }

    if (event.target.closest('#loginModal form')) {
        event.preventDefault();
        const form = event.target;
        const username = form.username.value;
        const password = form.password.value;
        const rememberMe = form.remember.checked;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const validUser = users.find(u => u.username === username && u.password === password);

        if (validUser) {
            if (rememberMe) {
                localStorage.setItem('currentUser', username);
            } else {
                sessionStorage.setItem('currentUser', username);
            }
            
            closeModal('loginModal');
            updateAuthUI(); 
            alert('¡Has iniciado sesión con éxito!');
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    }
});

function handleLogout() {
    alert('Sesión cerrada');
    localStorage.removeItem('currentUser'); 
    sessionStorage.removeItem('currentUser'); 
    window.location.href = 'index.html';
}

async function initializeTestUsers() {
    try {
        const response = await fetch('json/users.json');
        if (response.ok) {
            const testUsers = await response.json();
            
            let existingUsers = JSON.parse(localStorage.getItem('users')) || [];
            let modified = false;

            testUsers.forEach(testUser => {
                const exists = existingUsers.find(u => u.username === testUser.username);
                
                if (!exists) {
                    existingUsers.push(testUser);
                    modified = true;
                }
            });

            if (modified) {
                localStorage.setItem('users', JSON.stringify(existingUsers));
                console.log("Usuarios de prueba cargados y fusionados con éxito.");
            }
        }
    } catch (error) {
        console.error("Error al cargar los usuarios de prueba: ", error);
    }
}

initializeTestUsers();

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('toggle-password')) {
        const icon = event.target;
        const inputField = icon.parentElement.querySelector('input');

        if (inputField.type === 'password') {
            inputField.type = 'text';
            icon.classList.remove('bxs-lock-alt');
            icon.classList.add('bx-show'); 
        } else {
            inputField.type = 'password';
            icon.classList.remove('bx-show');
            icon.classList.add('bxs-lock-alt');
        }
    }
});