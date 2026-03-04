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

        container.dataset.paginated = "true";
    });
});
