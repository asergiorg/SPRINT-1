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

function handleLogout() {
  alert('Sesión cerrada');
  localStorage.clear();
  window.location.href = 'index.html';
}
