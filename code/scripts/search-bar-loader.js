document.addEventListener("contentLoaded", () => {

    // Solo activar búsqueda en el catálogo
    const pagina = window.location.pathname.split('/').pop().replace('.html', '');
    if (pagina !== "activities") return;

    const searchForm = document.querySelector("#search_container form");
    const searchInput = searchForm?.querySelector("input[name='activity']");

    if (!searchForm || !searchInput) return;

    // Si venimos desde el index con una búsqueda guardada
    const busquedaGuardada = localStorage.getItem("catalogSearch");

    if (busquedaGuardada) {
        searchInput.value = busquedaGuardada;
        localStorage.removeItem("catalogSearch");
        aplicarBusqueda(); // Ejecutar búsqueda automáticamente
    }

    // Evento de búsqueda manual
    searchForm.addEventListener("submit", e => {
        e.preventDefault();
        aplicarBusqueda();
    });

    // Función principal de búsqueda
    async function aplicarBusqueda() {
        const texto = searchInput.value.trim().toLowerCase();

        // Si no hay texto, mostrar catálogo completo
        if (!texto) {
            renderCatalogo(window.catalogoOriginal);
            return;
        }

        const resultados = window.catalogoOriginal.filter(item => {
            const nombre = item.name?.toLowerCase() || "";
            return nombre.includes(texto);
        });

        renderCatalogo(resultados);
    }

    // Renderizado reutilizando tu sistema de templates
    async function renderCatalogo(lista) {
        const contenedor = document.querySelector('[data-content-id]');
        const templateUrl = contenedor.dataset.template;
        const templateNode = await cargarTemplate(templateUrl);

        contenedor.innerHTML = "";

        lista.forEach(item => {
            const clone = templateNode.cloneNode(true);

            Object.keys(item).forEach(prop => {
                const target = clone.querySelector(`[data-field="${prop}"]`);
                if (target) {
                    if (target.tagName === 'IMG') {
                        target.src = item[prop];
                    } else {
                        target.textContent = Array.isArray(item[prop])
                            ? item[prop].join(", ")
                            : item[prop];
                    }
                }
            });

            contenedor.appendChild(clone);
        });

        activarClicks();
    }

    // Click en tarjetas
    function activarClicks() {
        document.querySelectorAll(".activity-card").forEach(card => {
            card.addEventListener("click", e => {
                const activity = e.target.closest(".activity-card");
                const id = activity.querySelector(".activity-id").textContent.trim();
                localStorage.setItem("selectedActivityId", id);
                window.location.href = "activity-information.html";
            });
        });
    }
});