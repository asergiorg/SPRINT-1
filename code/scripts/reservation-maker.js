document.addEventListener('contentLoaded', function () {
    const form = document.querySelector('.reservation-form');
    if (!form) return;

    
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Recopilar datos del formulario de la reserva
        const date = window.selectedReservationData ? window.selectedReservationData.date : null;
        const time = window.selectedReservationData ? window.selectedReservationData.time : null;
        const participants = window.selectedReservationData ? window.selectedReservationData.participants : 1;
    
        if (!date || !time) {
            alert("Please select a date and time for your reservation");
            return;
        }

        // Recopilar datos de la actividad
        const id = localStorage.getItem("selectedActivityId");
        if (!id) {
            alert("Error: No activity selected.");
            return;
        }

        let activityName = "";
        let individualPrice = 0;

        try {
            const response = await fetch('json/activities.json');
            const activities = await response.json();

            const currentActivity = activities.find(act => String(act.id) === String(id));

            if (currentActivity) {
                activityName = currentActivity.name;
                individualPrice = Number(currentActivity.price.replace(/[^0-9.]/g, ""));
            } else {
                alert("Error: Activity not found in database.");
                return;
            }
        } catch (error) {
            console.error("Error loading activities from JSON", error);
            alert("Error processing reservation. Please try again.");
            return;
        }
        
        // Datos del usuario
        const name = 'John Doe';
        
        // Cargar datos de la reserva, existente o nueva
        const reservas = JSON.parse(sessionStorage.getItem('reservations')) || [];
        const code = codeMaker(reservas);
        const newPrice = individualPrice * participants;
        const amountToPay = totalToPay(newPrice);
        const status = paymentStatus(amountToPay);

        const reservation = {
            activity_id: id,
            code: code,
            holder: name,
            activity: activityName,
            date: date,
            time: time,
            participants: participants,
            price: amountToPay,
            status: status
        };


        sessionStorage.setItem('currentReservation', JSON.stringify(reservation));
        localStorage.setItem("selectedReservationId", code); // Guardar ID para la página de detalles
        
        // redirigir a la página de detalles de la reserva
        window.location.href = 'reservation-information.html';
    });
});

// ------------------ FUNCIONES ------------------

function codeMaker(reservations) {
    const usados = new Set(reservations.map(r => r.code));

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
        console.log(diff)
        return Math.max(diff, 0);
    }

    return newPrice;
}
