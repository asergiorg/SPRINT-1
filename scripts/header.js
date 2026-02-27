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
