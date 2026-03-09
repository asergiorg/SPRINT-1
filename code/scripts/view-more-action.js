document.addEventListener("contentLoaded", () => {
    const step = 5;

    document.querySelectorAll(".viewMoreBtn").forEach(btn => {
        const targetId = btn.dataset.target;
        const container = document.getElementById(targetId);

        if (!container) return;

        const cards = Array.from(container.children);

        // Evitar repetir si ya se aplicó
        if (container.dataset.paginated === "true") return;

        // Botón "Collapse"
        const lessBtn = document.querySelector(`.colapseBtn[data-target="${targetId}"]`);

        // Ocultar collapse al inicio
        if (lessBtn) {
            lessBtn.style.display = "none";
        }

        // Si hay 5 o menos elementos, ocultar "View more"
        if (cards.length <= step) {
            btn.style.display = "none";
            return;
        }

        // Ocultar todas excepto las primeras 5
        cards.forEach((card, i) => {
            if (i >= step) card.style.display = "none";
        });

        let visibleCount = step;

        // --- VIEW MORE ---
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            const next = visibleCount + step;

            cards.slice(visibleCount, next).forEach(card => {
                card.style.display = "";
            });

            visibleCount = next;

            // Mostrar collapse solo después del primer click
            if (lessBtn) {
                lessBtn.style.display = "inline-block";
            }

            // Si ya no quedan más, ocultar el botón
            if (visibleCount >= cards.length) {
                btn.style.display = "none";
            }
        });

        // --- COLLAPSE ---
        if (lessBtn) {
            lessBtn.addEventListener("click", () => {

                // Ocultar todas excepto las primeras 5
                cards.forEach((card, i) => {
                    card.style.display = i < step ? "" : "none";
                });

                visibleCount = step;

                // Mostrar de nuevo el botón "View more"
                if (cards.length > step) {
                    btn.style.display = "inline-block";
                }

                // Ocultar collapse otra vez
                lessBtn.style.display = "none";
            });
        }

        container.dataset.paginated = "true";
    });
});
