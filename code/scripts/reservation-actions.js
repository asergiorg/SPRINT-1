document.addEventListener("contentLoaded", () => {
    const cancelBtn = document.querySelector("#cancel");

    if (!cancelBtn) return;

    cancelBtn.addEventListener("click", e => {
        e.preventDefault();

        sessionStorage.removeItem("reservationToEdit");
        const reservation = JSON.parse(sessionStorage.getItem("currentReservation"));
        const reservations = JSON.parse(sessionStorage.getItem("reservations"));
        const storaged =  reservations.filter(r => r.code !== reservation.code);
        if(storaged.length !== reservations.length){
            sessionStorage.setItem("reservations", JSON.stringify(storaged));
        }
        sessionStorage.removeItem("currentReservation");

        history.back();
    });
});

document.addEventListener("contentLoaded", () => {
    const payButtons = document.querySelectorAll(".pm-btn");
    const idElement = document.querySelector("#code");

    if (!idElement) return;

    payButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            // Mostrar feedback al usuario
            btn.disabled = true;
            btn.textContent = "Procesando pago...";

            // Simular delay de 2 segundos
            setTimeout(() => {
                const old = JSON.parse(sessionStorage.getItem("currentReservation"));
            
                reservation = {
                    ...old,
                    status: 'Pending'
                };
            
                sessionStorage.setItem("currentReservation", JSON.stringify(reservation));

                location.reload();
            }, 2000);
        });
    });
});

document.addEventListener("contentLoaded", () => {
    const confirmBtn = document.querySelector("#confirm");
    const idElement = document.querySelector("#code");
    const warning = document.querySelector("#payment-warning");

    if (!confirmBtn || !idElement) return;

    confirmBtn.addEventListener("click", () => {
        const reservations = JSON.parse(sessionStorage.getItem("reservations")) || [];
        const reservation = JSON.parse(sessionStorage.getItem("currentReservation"));
        const editing = sessionStorage.getItem("reservationToEdit");

        if (!reservation || reservation.status === "Unpaid") {
            // Mostrar mensaje
            warning.style.display = "block";
            return;
        }
        let old = reservation;
        if (editing) {
            
            old = JSON.parse(editing); 
        } 
        const index = reservations.findIndex(r => r.code === old.code);
        if (index !== -1) {
        reservations[index] = reservation; // reemplazo correcto
        } else {
            reservations.push(reservation)
        }

        sessionStorage.setItem("reservations", JSON.stringify(reservations));
        sessionStorage.removeItem("currentReservation");
        sessionStorage.removeItem("reservationToEdit");

        window.location.href = 'user-activities.html';
    });

});

document.addEventListener("contentLoaded", () => {
    const editBtn = document.querySelector("#edit-btn");
    const idElement = document.querySelector("#code");

    if (!editBtn || !idElement) return;

    editBtn.addEventListener("click", () => {
        const reservation = JSON.parse(sessionStorage.getItem("currentReservation"))

        if (!reservation) return;

        // Guardar la reserva que se quiere editar
        localStorage.setItem("selectedActivityId", reservation.activity_id); // Para cargar info de la actividad en el formulario
        sessionStorage.setItem("reservationToEdit", JSON.stringify(reservation));
        window.location.href = 'activity-information.html';
    });
});
