document.addEventListener('contentLoaded', function () {
    const form = document.querySelector('.reservation-form');
    if (!form) return;

    
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        // Datos del formulario
        const time = document.getElementById('time')?.value || '';
        const people = Number(document.getElementById('people').value);
        const date = new Date().toISOString().slice(0, 10);
        
        // Datos de la actividad
        const activity = document.querySelector('.activity-title').textContent.trim();
        const id = localStorage.getItem("selectedActivityId");
        
        
        // Precio individual (limpiado)
        const priceText = document.getElementById('price').textContent;
        const individualPrice = Number(priceText.replace(/[^0-9.]/g, ""));
        
        // Datos del usuario
        const name = 'John Doe';
        
        // Cargar reservas
        const reservas = JSON.parse(sessionStorage.getItem('reservations')) || [];
        const reservationToEdit = sessionStorage.getItem('reservationToEdit');

        
        // ¿Estamos editando?
        let reservation;
        
        if (reservationToEdit) {
            const old = JSON.parse(reservationToEdit);
            
            const newPrice = individualPrice * people;
            const amountToPay = totalToPay(newPrice);
            const status = paymentStatus(amountToPay);
            
            // FUSIÓN SEGURA: mantiene todo lo anterior y solo actualiza lo necesario
            reservation = {
                ...old,
                time: time,
                participants: people,
                price: amountToPay,
                status: status
            };
            
        } else {
            
            // Nueva reserva
            const code = codeMaker(reservas);
            const newPrice = individualPrice * people;
            const amountToPay = totalToPay(newPrice);
            const status = paymentStatus(amountToPay);
            
            reservation = {
                activity_id: id,
                code: code,
                name: name,
                activity: activity,
                date: date,
                time: time,
                participants: people,
                price: amountToPay,
                status: status
            };
            
        }
        
        // Guardar
        sessionStorage.setItem('currentReservation', JSON.stringify(reservation));
        localStorage.setItem("selectedReservationId", reservation.code);

        // Redirigir
        window.location.href = 'reservation-information.html';
    });
});

// ------------------ FUNCIONES ------------------

function codeMaker(reservas) {
    const usados = new Set(reservas.map(r => r.code)) || {};

    while (true) {
        const num = Math.floor(Math.random() * 100000);
        const codigo = "res-" + String(num).padStart(5, "0");

        if (!usados.has(codigo)) return codigo;
    }
}

function paymentStatus(amountToPay) {
    return amountToPay > 0 ? "Unpaid" : "Pending";
}

function totalToPay(newPrice) {
    const editing = sessionStorage.getItem('reservationToEdit');
    if (!editing) return newPrice;
    
    const old = JSON.parse(editing);
    
    if (old.status !== "Unpaid") {
        const diff = newPrice - old.price;
        return Math.max(diff, 0);
    }

    return newPrice;
}
