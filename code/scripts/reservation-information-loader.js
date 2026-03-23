document.addEventListener("DOMContentLoaded", async () => {
    const selectedId = localStorage.getItem("selectedReservationId");
    if (!selectedId) return;

    const container = document.querySelector("[data-content-id][data-json]");
    if (!container) return;

    const reservas = JSON.parse(sessionStorage.getItem('reservations')) || [];
    const item = reservas.find(r => r.code === selectedId);

    if (!item) return;

    // 4. Rellenar datos en pantalla
    Object.keys(item).forEach(prop => {
        const el = container.querySelector(`[data-field="${prop}"]`);
        if (!el) return;

        if (el.tagName === "IMG") {
            el.src = item[prop];
        } else {
            el.textContent = item[prop];
        }
    });

    // 5. Insertar métodos de pago si está unpaid
    const status = item.status?.trim().toLowerCase();
    const isUnpaid = status === "unpaid";

    if (isUnpaid) {
        const reservationCard = document.querySelector("#reservation-card");
        const footer = reservationCard.querySelector("footer.actions");

        reservationCard.insertBefore(
            await loadTemplate("templates/payment-methods.html"),
            footer
        );
    }
    document.dispatchEvent(new Event('contentLoaded'));
});

async function loadTemplate(url) {
    const response = await fetch(url);
    const html = await response.text();
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content;
}
