async function loadAndOpenLogin() {
  let modal = document.getElementById("loginModal");

  if (!modal) {
    try {
      const response = await fetch("login-modal.html");

      if (!response.ok) throw new Error("No se pudo cargar login-modal.html");

      const htmlSnippet = await response.text();

      document.body.insertAdjacentHTML("beforeend", htmlSnippet);
      modal = document.getElementById("loginModal");

      modal.style.display = "flex";

      window.onclick = function(event) {
        if (event.target === modal) {
          closeLoginModal();
        }
      }

    } catch (error) {
      console.error("Error al cargar el modal de login:", error);
    }
  } else {
    modal.style.display = "flex";
  }
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function handleLogout() {
  alert('Sesión cerrada');
  localStorage.clear();
  window.location.href = 'index.html';
}
