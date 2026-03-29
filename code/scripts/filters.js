document.addEventListener("contentLoaded", () => {

    const pagina = window.location.pathname.split('/').pop().replace('.html', '');
    if (pagina !== "activities") return;

  
    const filterForm = document.querySelector("#filterbar form");
    if (!filterForm) {
        console.warn("Filter form not found");
        return;
    }

    const applyBtn = filterForm.querySelector("button[type='button']");
    if (!applyBtn) {
        console.warn("Apply button not found");
        return;
    }

    applyBtn.addEventListener("click", () => {
        aplicarFiltros();
    });

    function parsePrice(priceString) {
        return parseFloat(priceString.replace("€", "").trim());
    }

    function parseDuration(durationString) {
        return parseFloat(durationString);
    }

    function aplicarFiltros() {

        const priceMin = filterForm.price_min.value.trim();
        const priceMax = filterForm.price_max.value.trim();

        const durationMin = filterForm.duration_min.value.trim();
        const durationMax = filterForm.duration_max.value.trim();
        
        const language = filterForm.language.value;
        const stars = filterForm.stars.value;
        const difficulty = filterForm.difficulty.value;

        const filtrado = window.catalogoOriginal.filter(item => {

            const itemPrice = parsePrice(item.price);
            const itemDuration = parseDuration(item.duration);

            // Price
            if (priceMin !== "" && itemPrice < Number(priceMin)) return false;
            if (priceMax !== "" && itemPrice > Number(priceMax)) return false;

            // Duration
            if (durationMin !== "" && itemDuration < Number(durationMin)) return false;
            if (durationMax !== "" && itemDuration > Number(durationMax)) return false;

            // Language
            if (language !== "all" && !item.languages.includes(language)) return false;

            // Stars
            if (stars !== "all" && Math.floor(item.rating) < Number(stars)) return false;

            // Difficulty
            if (difficulty !== "all" && item.difficulty !== difficulty) return false;

            return true;
        });

        renderCatalogo(filtrado);
    }

    async function renderCatalogo(lista) {

        const contenedor = document.querySelector('[data-content-id="activities"]');
        const templateUrl = contenedor.dataset.template;
        const templateNode = await loadTemplate(templateUrl);

        contenedor.replaceChildren();

        lista.forEach(item => {
            const clone = templateNode.cloneNode(true);

            Object.keys(item).forEach(prop => {
                const target = clone.querySelector(`[data-field="${prop}"]`);
                if (!target) return;

                let value = item[prop];

                if (Array.isArray(value)) {
                    value = value.join(", ");
                }

                if (target.tagName === "IMG") {
                    target.src = value;
                } else {
                    target.textContent = value;
                }
            });

            contenedor.appendChild(clone);
        });

        activarClicks();
    }

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

    const filterbar = document.getElementById('filterbar');
    const overlay = document.getElementById('filtersOverlay');
    const openBtn = document.getElementById('openFilters');
    const closeBtn = document.getElementById('closeFilters');

    if (openBtn && closeBtn && filterbar && overlay) {
        openBtn.addEventListener("click", () => {
            filterbar.classList.add("open");
            overlay.classList.add("visible");
        });

        closeBtn.addEventListener("click", () => {
            filterbar.classList.remove("open");
            overlay.classList.remove("visible");
        });

        overlay.addEventListener("click", () => {
            filterbar.classList.remove("open");
            overlay.classList.remove("visible");
        });
    }

});