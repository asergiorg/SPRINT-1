// Guardar reserva en sessionStorage y redirigir a la página de información de la reserva
document.addEventListener('contentLoaded', function(){
    const form = document.querySelector('.reservation-form');
    if(!form) return;

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
        const id = idMaker();
        
        const reservation = {
            id: id,
            name,
            activity,
            date,
            time,
            people,
            price: (people * 30) // ejemplo: 30€ por persona
        };
        
        const reservas = JSON.parse(sessionStorage.getItem('reservations')) || [];
        reservas.push(reservation);
        sessionStorage.setItem('reservations', JSON.stringify(reservas));
        localStorage.setItem("selectedReservationId", id); // Guardar ID para la página de detalles
        
        // redirigir a la página de detalles de la reserva
        window.location.href = 'reservation-information.html';

    });
});

function idMaker() {
    const reservas = JSON.parse(sessionStorage.getItem('reservations')) || [];
    const ids = reservas.map(r => parseInt(r.id)).filter(n => !isNaN(n));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
}