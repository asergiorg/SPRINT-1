document.addEventListener("contentLoaded", () => {
    const step = 5;

    document.querySelectorAll(".viewMoreBtn").forEach(btn => {
        const targetId = btn.dataset.target;
        const container = document.getElementById(targetId);

        if (!container) return;

        const cards = Array.from(container.children);

        // Evitar repetir si ya se aplicó
        if (container.dataset.paginated === "true") return;

        // Ocultar todas excepto las primeras 5
        cards.forEach((card, i) => {
            if (i >= step) card.style.display = "none";
        });

        let visibleCount = step;

        // Botón "Ver menos"
        const lessBtn = document.querySelector(`.colapseBtn[data-target="${targetId}"]`);

        btn.addEventListener("click", (e) => {
            e.preventDefault();

            const next = visibleCount + step;

            cards.slice(visibleCount, next).forEach(card => {
                card.style.display = "";
            });

            visibleCount = next;

            if (visibleCount >= cards.length) {
                btn.style.display = "none";
            }
        });

        // Lógica del botón "Ver menos"
        if (lessBtn) {
            lessBtn.addEventListener("click", () => {
                // Ocultar todas excepto las primeras 5
                cards.forEach((card, i) => {
                    card.style.display = i < step ? "" : "none";
                });

                visibleCount = step;

                // Mostrar de nuevo el botón "Ver más"
                btn.style.display = "inline-block";
            });
        }

        container.dataset.paginated = "true";
    });
});

document.addEventListener("contentLoaded", () => {
    document.querySelectorAll(".activity-card").forEach(link => {
        link.addEventListener("click", e => {
            const card = e.target.closest(".activity-card");
            const id = card.querySelector("#row-res-id").textContent.trim();

            localStorage.setItem("selectedReservationId", id);
        });
    });
});


