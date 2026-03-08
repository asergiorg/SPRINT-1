document.addEventListener("DOMContentLoaded", async () => {
    await cargarReservasSinPerderDatos();
    const selectedId = localStorage.getItem("selectedReservationId");
    if (!selectedId) return;

    const container = document.querySelector("[data-content-id][data-json]");
    if (!container) return;

    const key = container.dataset.contentId;
    let data;

    // 1. Cargar datos dinámicamente según origen
    if (sessionStorage.getItem('reservations')) {
        data = JSON.parse(sessionStorage.getItem('reservations'));
    } else {
        const jsonUrl = container.dataset.json;
        data = await fetch(jsonUrl).then(r => r.json());

        // Guardar para futuras visitas
        sessionStorage.setItem('reservations', JSON.stringify(data));
    }

    // 2. Acceder a la lista correspondiente
    const items = data;
    if (!items) return;

    // 3. Buscar la reserva seleccionada
    const reservation = items.find(item => item.code == selectedId);
    if (!reservation) return;

    // 4. Rellenar datos en pantalla
    Object.keys(reservation).forEach(prop => {
        const el = container.querySelector(`[data-field="${prop}"]`);
        if (!el) return;

        if (el.tagName === "IMG") {
            el.src = reservation[prop];
        } else {
            el.textContent = reservation[prop];
        }
    });

    // 5. Insertar métodos de pago si está unpaid
    const status = reservation.status?.trim().toLowerCase();
    const isUnpaid = status === "unpaid";

    if (isUnpaid) {
        const reservationCard = document.querySelector("#reservation-card");
        const footer = reservationCard.querySelector("footer.actions");

        reservationCard.insertBefore(
            await cargarTemplate("templates/payment-methods.html"),
            footer
        );
    }
    document.dispatchEvent(new Event('contentLoaded'));
});

async function cargarTemplate(url) {
    const response = await fetch(url);
    const html = await response.text();
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content;
}

async function cargarReservasSinPerderDatos() {
    // 1. Leer lo que ya existe en sessionStorage
    const stored = sessionStorage.getItem("reservas");
    const oldArray = stored ? JSON.parse(stored) : [];

    // 2. Cargar el JSON nuevo
    const response = await fetch("json/reservations.json");
    const newData = await response.json();

    // Si tu JSON tiene la forma { "reservations": [ ... ] }
    const newArray = Array.isArray(newData) ? newData : newData.reservations;

    // 3. Fusionar ambos arrays
    const merged = [...oldArray, ...newArray];

    // 4. Eliminar duplicados por id
    const unique = merged.filter(
        (item, index, arr) => index === arr.findIndex(r => r.id === item.id)
    );

    // 5. Guardar el resultado final
    sessionStorage.setItem("reservas", JSON.stringify(unique));
}

