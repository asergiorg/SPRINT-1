document.addEventListener("contentLoaded", () => {
    const reviewItem = document.querySelector(".review-item");
    const submitBtn = reviewItem.querySelector(".submit-btn");
    const commentBox = reviewItem.querySelector(".comment-box");
    const stars = reviewItem.querySelectorAll(".star");

    let currentRating = 0;

    // Listener para seleccionar estrellas
    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            currentRating = index + 1;

            // Actualizar visualmente
            stars.forEach((s, i) => {
                s.textContent = i < currentRating ? "★" : "☆";
            });
        });
    });

    // Listener para el botón Submit
    submitBtn.addEventListener("click", () => {
        const comment = commentBox.value.trim();

        if (!comment || currentRating === 0) {
            alert("Por favor, escribe un comentario y selecciona una puntuación.");
            return;
        }

        // Recuperar lista de reviews
        const stored = sessionStorage.getItem("reviews");
        const reviews = stored ? JSON.parse(stored) : [];
        const activity_id = localStorage.getItem("selectedActivityId")

        // Crear nueva review
        const newReview = {
            activity_id: activity_id,
            user: "Username", // Puedes cambiarlo si tienes login
            body: comment,
            rating: currentRating
        };

        // Añadir y guardar
        reviews.push(newReview);
        sessionStorage.setItem("reviews", JSON.stringify(reviews));

        location.reload();

        // Reset
        commentBox.value = "";
        currentRating = 0;
        stars.forEach(s => s.textContent = "☆");
    });
});
