// Guardar reserva en sessionStorage y redirigir a la página de información de la reserva
document.addEventListener('contentLoaded', function (){
    const form = document.querySelector('.reservation-form');
    if(!form) return;

    let reservas = JSON.parse(sessionStorage.getItem('reservations')) || [];
    if(!reservas) {
        const data = fetch(jsonUrl).then(r => r.json()).then(data => {
            sessionStorage.setItem('reservations', JSON.stringify(data));
        });
    }

    form.addEventListener('submit', function(e){
        e.preventDefault();
        const time = document.getElementById('time') ? document.getElementById('time').value : '';
        const people = document.getElementById('people') ? Number(document.getElementById('people').value) : 1;
        // Intentar obtener un título de actividad desde la sección de detalles
        const activityTitleEl = document.querySelector('.activity-details h1');
        const activity = activityTitleEl ? activityTitleEl.textContent.trim() : 'Actividad';
        // Fecha: si tu calendario tiene selección, reemplaza esta línea por la fecha seleccionada
        const date = new Date().toISOString().slice(0,10);
        const name = 'Jhon Doe'; 
        reservas = JSON.parse(sessionStorage.getItem('reservations')) || [];

        const id = idMaker(reservas);
        const code = codeMaker(reservas);
        const status = "Unpaid"
        
        const reservation = {
            id: id,
            code: code,
            name: name,
            activity: activity,
            date: date,
            time: time,
            participants: people,
            price: (people * 30),
            status: status
        };

        reservas.push(reservation);
        sessionStorage.setItem('reservations', JSON.stringify(reservas));
        localStorage.setItem("selectedReservationId", code); // Guardar ID para la página de detalles
        
        // redirigir a la página de detalles de la reserva
        window.location.href = 'reservation-information.html';

    });
});

// Genera un ID incremental basado en los existentes
function idMaker(reservas) {
    const ids = reservas.map(r => parseInt(r.id)).filter(n => !isNaN(n));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
}


// Genera un código único de 5 dígitos que no exista ya
function codeMaker(reservas) {
    if (sessionStorage.getItem('reservationToEdit')) {
        const reservation = JSON.parse(sessionStorage.getItem('reservationToEdit'));
        sessionStorage.removeItem('reservationToEdit');
        return reservation.code; // Reutilizar el mismo código para ediciones
    }
    else {
        const usados = new Set(reservas.map(r => r.code));

        while (true) {
            const num = Math.floor(Math.random() * 100000);
            const codigo = String(num).padStart(5, "0");

            if (!usados.has("res-" + codigo)) {
                return "res-" + codigo;
            }
        }
    }
}