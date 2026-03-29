document.addEventListener("contentLoaded", () => {
    const reviewItem = document.querySelector(".review-item");
    if (!reviewItem) return;

    const submitBtn = reviewItem.querySelector(".submit-btn");
    const commentBox = reviewItem.querySelector(".comment-box");
    const stars = reviewItem.querySelectorAll(".star");

    const counter = reviewItem.querySelector(".char-counter");
    const maxLength = commentBox.getAttribute("maxlength");

    let currentRating = 0;

    // Listener para seleccionar estrellas
    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            const newRating = index + 1;
            
            if (currentRating === newRating) {
                currentRating = 0;
            } else {
                currentRating = newRating;
            }

            stars.forEach((s, i) => {
                if (i < currentRating) {
                    s.textContent = "★";
                    s.classList.add("filled");
                } else {
                    s.textContent = "☆";
                    s.classList.remove("filled");
                }
            });
        });
    });


    if (commentBox && counter) {
        commentBox.addEventListener("input", () => {
            const currentLength = commentBox.value.length;
            counter.textContent = `${currentLength} / ${maxLength}`;

            if (currentLength >= maxLength * 0.9) {
                counter.classList.add("limit-reached");
            } else {
                counter.classList.remove("limit-reached");
            }
        });
    }

    // Listener para el botón Submit
    submitBtn.addEventListener("click", () => {

        const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');

        if (!currentUser) {
            alert("Debes iniciar sesión para publicar una reseña.");
            return;
        }

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
            user: currentUser,
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

        if (counter) counter.textContent = `0 / ${maxLength}`;
        if (counter) counter.classList.remove("limit-reached");
    });
});
