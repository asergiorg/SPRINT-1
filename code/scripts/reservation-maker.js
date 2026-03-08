// Guardar reserva en sessionStorage y redirigir a la página de información de la reserva
document.addEventListener('contentLoaded', function (){
    const form = document.querySelector('.reservation-form');
    if(!form) return;

    let reservas = JSON.parse(sessionStorage.getItem('reservations')) || [];
    if(!reservas) {
        const data = fetch(jsonUrl)
        .then(r => r.json())
        .then(data => {
            sessionStorage.setItem('reservations', JSON.stringify(data));
        });
    }

    form.addEventListener('submit', function(e){
        e.preventDefault();

        // Recopilar datos del formulario
        const time = document.getElementById('time') ? document.getElementById('time').value : '';
        const people = Number(document.getElementById('people').value);
        // TODO: leer fecha desde el calendario
        const date = new Date().toISOString().slice(0,10);

        // Recopilar datos de la actividad
        const activity = document.querySelector('.activity-title').textContent.trim();
        const id = localStorage.getItem("selectedActivityId"); 
        const individualPrice = Number(document.getElementById('price').textContent);
        
        // Cargar datos del usuario
        const name = 'Jhon Doe';
        
        // Cargar datos de la reserva, existente o nueva
        reservas = JSON.parse(sessionStorage.getItem('reservations')) || [];
        const code = codeMaker(reservas);
        const newPrice = individualPrice * people;
        const amountToPay = totalToPay(newPrice);
        const status = paymentStatus(amountToPay);

        const reservation = {
            activity_id: id,
            code: code,
            name: name,
            activity: activity,
            date: date,
            time: time,
            participants: people,
            price: newPrice,
            status: status
        };


        reservas.push(reservation);
        sessionStorage.setItem('reservations', JSON.stringify(reservas));
        localStorage.setItem("selectedReservationId", code); // Guardar ID para la página de detalles
        
        // redirigir a la página de detalles de la reserva
        window.location.href = 'reservation-information.html';

    });
});


// Genera un código único de 5 dígitos que no exista ya
function codeMaker(reservas) {
    if (sessionStorage.getItem('reservationToEdit')) {
        const reservation = JSON.parse(sessionStorage.getItem('reservationToEdit'));
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

function paymentStatus(amountToPay) {
    return amountToPay > 0 ? "Unpaid" : "Pending";
}


function totalToPay(newPrice) {
    const editing = sessionStorage.getItem('reservationToEdit');
    if (!editing) return newPrice;

    const old = JSON.parse(editing);
    const oldPrice = old.price;
    const oldStatus = old.status;

    // Si ya estaba pagada, solo se paga la diferencia
    if (oldStatus !== "Unpaid") {
        const difference = newPrice - oldPrice;
        return Math.max(difference, 0); // nunca negativo
    }

    // Si no estaba pagada, se paga el precio completo
    return newPrice;
}
