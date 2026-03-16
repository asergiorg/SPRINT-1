document.addEventListener("contentLoaded", () => {

    const pagina = window.location.pathname.split('/').pop().replace('.html', '');
    if (pagina !== "index") return;

    const searchForm = document.querySelector("#bar-search-container form");
    const searchInput = searchForm?.querySelector("input[name='activity']");

    if (!searchForm || !searchInput) return;

    // Evento de búsqueda manual
    searchForm.addEventListener("submit", e => {
        e.preventDefault();

        const value = searchInput.value.trim().toLowerCase();
        localStorage.setItem("catalogSearch", value);

        window.location.href = "activities.html";
    });

});