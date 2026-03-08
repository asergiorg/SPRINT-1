document.addEventListener("contentLoaded", () => {
    const cancelBtn = document.querySelector("#cancel");

    if (!cancelBtn) return;

    cancelBtn.addEventListener("click", e => {
        e.preventDefault();

        const idElement = document.querySelector("#row-res-id");
        if (!idElement) {
            console.error("No se encontró #row-res-id en esta página");
            history.back();
            return;
        }

        const id = idElement.textContent.trim(); 

        let reservas = JSON.parse(sessionStorage.getItem("reservations")) || [];
        reservas = reservas.filter(r => r.code != id);
        sessionStorage.setItem("reservations", JSON.stringify(reservas));

        history.back();
    });
});

document.addEventListener("contentLoaded", () => {
    const payButtons = document.querySelectorAll(".pm-btn");
    const idElement = document.querySelector("#row-res-id");

    if (!idElement) return;

    const reservationId = idElement.textContent.trim();

    payButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            // Mostrar feedback al usuario
            btn.disabled = true;
            btn.textContent = "Procesando pago...";

            // Simular delay de 2 segundos
            setTimeout(() => {
                let reservas = JSON.parse(sessionStorage.getItem("reservations")) || [];

                reservas = reservas.map(r => {
                    if (r.code === reservationId) {
                        return {
                            "id": r.id,
                            "code": r.code,
                            "activity": r.activity,
                            "date": r.date,
                            "time": r.time,
                            "participants": r.participants,
                            "price": r.price, 
                            "status": "Pending"
                        };
                    }
                    return r;
                });

                sessionStorage.setItem("reservations", JSON.stringify(reservas));

                location.reload();
            }, 2000);
        });
    });
});

document.addEventListener("contentLoaded", () => {
    const confirmBtn = document.querySelector("#confirm");
    const idElement = document.querySelector("#row-res-id");
    const warning = document.querySelector("#payment-warning");

    if (!confirmBtn || !idElement) return;

    const reservationId = idElement.textContent.trim();

    confirmBtn.addEventListener("click", () => {
        const reservas = JSON.parse(sessionStorage.getItem("reservations")) || [];
        const reserva = reservas.find(r => r.code === reservationId);
        const status = reserva.status.trim().toLowerCase();

        if (!reserva || status === "unpaid") {
            // Mostrar mensaje
            warning.style.display = "block";
            return;
        }

        // Si está pagada, continuar
        // Aquí pones lo que quieras: redirigir, avanzar, etc.
        window.location.href='user-activities.html';
    });
});

document.addEventListener("contentLoaded", () => {
    const editBtn = document.querySelector("#edit-btn");
    const idElement = document.querySelector("#row-res-id");

    if (!editBtn || !idElement) return;

    const reservationId = idElement.textContent.trim();

    editBtn.addEventListener("click", () => {
        let reservas = JSON.parse(sessionStorage.getItem("reservations")) || [];
        const reserva = reservas.find(r => r.code === reservationId);

        if (!reserva) return;

        // Guardar la reserva que se quiere editar
        sessionStorage.setItem("reservationToEdit", JSON.stringify(reserva));

        // Se elimina la reserva actual para evitar duplicados al guardar cambios
        reservas = reservas.filter(r => r.code != reservationId);
        sessionStorage.setItem("reservations", JSON.stringify(reservas));

        window.location.href = 'activity-information.html';
    });
});
