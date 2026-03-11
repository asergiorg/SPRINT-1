document.addEventListener("contentLoaded", () => {
    const cancelBtn = document.querySelector("#cancel");

    if (!cancelBtn) return;

    cancelBtn.addEventListener("click", e => {
        e.preventDefault();

        sessionStorage.removeItem("reservationToEdit");
        const reserva = JSON.parse(sessionStorage.getItem("currentReservation"));
        const reservas = JSON.parse(sessionStorage.getItem("reservations"));
        const storaged =  reservas.filter(r => r.code != reserva.code);
        if(storaged.length !== reservas.length){
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
            
            
                // FUSIÓN SEGURA: mantiene todo lo anterior y solo actualiza lo necesario
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
        const reservas = JSON.parse(sessionStorage.getItem("reservations")) || [];
        const reserva = JSON.parse(sessionStorage.getItem("currentReservation"));
        const editing = sessionStorage.getItem("reservationToEdit");

        if (!reserva || reserva.status === "Unpaid") {
            // Mostrar mensaje
            warning.style.display = "block";
            return;
        }
        let old = reserva;
        if (editing) {
            // Estamos editando → reemplazar
            old = JSON.parse(editing); 
        } 
        const index = reservas.findIndex(r => r.code === old.code);
        if (index !== -1) {
        reservas[index] = reserva; // reemplazo correcto
        } else {
            reservas.push(reserva)
        }

        sessionStorage.setItem("reservations", JSON.stringify(reservas));
        sessionStorage.removeItem("currentReservation");
        sessionStorage.removeItem("reservationToEdit");

        window.location.href = 'user-activities.html';
    });

});

document.addEventListener("contentLoaded", () => {
    const editBtn = document.querySelector("#edit-btn");
    const idElement = document.querySelector("#row-res-id");

    if (!editBtn || !idElement) return;

    editBtn.addEventListener("click", () => {
        const reserva = JSON.parse(sessionStorage.getItem("currentReservation"))

        if (!reserva) return;

        // Guardar la reserva que se quiere editar
        localStorage.setItem("selectedActivityId", reserva.activity_id); // Para cargar info de la actividad en el formulario
        sessionStorage.setItem("reservationToEdit", JSON.stringify(reserva))
        window.location.href = 'activity-information.html';
    });
});
