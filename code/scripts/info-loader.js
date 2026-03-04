document.addEventListener("DOMContentLoaded", async () => {
    const selectedId = localStorage.getItem("selectedReservationId");
    console.log("ID seleccionado:", selectedId);

    if (!selectedId) return;

    const container = document.querySelector("[data-json][data-content-id]");
    if (!container) return;

    const jsonUrl = container.dataset.json;
    const key = container.dataset.contentId;

    const data = await fetch(jsonUrl).then(r => r.json());
    const items = data[key];

    const reservation = items.find(item => item.id == selectedId);
    console.log("Reserva encontrada:", reservation);

    if (!reservation) return;

    Object.keys(reservation).forEach(prop => {
        const el = container.querySelector(`[data-field="${prop}"]`);
        if (!el) return;

        if (el.tagName === "IMG") {
            el.src = reservation[prop];
        } else {
            el.textContent = reservation[prop];
        }
    });
});
