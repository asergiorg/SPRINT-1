async function load(elements){
    await loadStructureWith(elements);
    document.dispatchEvent(new Event('contentLoaded'));
};

async function loadStructureWith(elements) {
    let activityLoad = false;
    for(const element of elements){
        document.body.appendChild(await loadTemplate('templates/' + element));
        if(element === "activity-information-body.html"){
            await loadActivityInformationData();
            activityLoad = true;
        }
        if(element === "user-activities-body.html" && !sessionStorage.getItem("reservations")){
            sessionStorage.setItem("reservations", "[]")
        }
    }
    if(!activityLoad){
        await loadDynamicContent();
    }
}

async function loadTemplate(url) {
    const response = await fetch(url);
    const html = await response.text();
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content;
}

async function loadDynamicContent() {    
    const pagina = window.location.pathname.split('/').pop().replace('.html', '');

    
    // Buscar contenedores dinámicos
    const contenedores = document.querySelectorAll('[data-content-id]');
    if (!contenedores.length) return;
    
    for (const contenedor of contenedores) {
        let items = await dataLoader(contenedor.dataset.json);
        
        if (pagina === "activities") {
            window.catalogoOriginal = items;
        }
        
        // Si estamos en la página de detalle, filtrar por ID 
        if (pagina === "activity-information") { 
            const selectedId = localStorage.getItem("selectedActivityId"); 
            items = items.filter(item => item.id == selectedId);
        }

        // Cargar template
        const templateUrl = contenedor.dataset.template;
        const templateNode = await loadTemplate(templateUrl);

        // Renderizar cada elemento del JSON
        items.forEach(item => {
            const clone = templateNode.cloneNode(true);

            // Rellenar campos del template
            Object.keys(item).forEach(prop => {
                const target = clone.querySelector(`[data-field="${prop}"]`);
                if (target) {
                    if (target.tagName === 'IMG') {
                        target.src = item[prop];
                    } else {
                        target.textContent = item[prop];
                    }
                }
            });

            contenedor.appendChild(clone);
        });
    }
}

async function loadActivityInformationData() {

    const contenedores = document.querySelectorAll("[data-content-id]");
    if (!contenedores.length) return;
    
    const data = await dataLoader(contenedores[0].dataset.json);
    
    
    // Filtrar por ID seleccionado
    const selectedId = localStorage.getItem("selectedActivityId");
    
    const item = data.find(act => act.id == selectedId);
    if (!item) return;
    
    // Rellenar TODOS los contenedores
    contenedores.forEach(contenedor => {
        
        Object.keys(item).forEach(prop => {
            const targets = contenedor.querySelectorAll(`[data-field="${prop}"]`);
            if (!targets.length) return;
            
            targets.forEach(target => {
                let value = item[prop];
                
                if (Array.isArray(value)) {
                    value = value.join(", ");
                }
                
                if (target.tagName === "IMG") {
                    target.src = value;
                } else {
                    target.textContent = value;
                }
            });
        });
    });
    let reviews = await dataLoader(contenedores[2].dataset.json);
    reviews = reviews.filter(r => r.activity_id == selectedId);

    // Cargar template
    const templateUrl = contenedores[2].dataset.template;
    const templateNode = await loadTemplate(templateUrl);
    
    // Renderizar cada elemento del JSON
    reviews.forEach(review => {
        const clone = templateNode.cloneNode(true);

        // Rellenar campos del template
        Object.keys(review).forEach(prop => {
            const target = clone.querySelector(`[data-field="${prop}"]`);
            if (target) {
                if (target.tagName === 'IMG') {
                    target.src = review[prop];
                } else {
                    target.textContent = review[prop];
                }
            }
        });

        // ⭐ Renderizar estrellas del rating
        const ratingContainer = clone.querySelector(".rating");
        if (ratingContainer && review.rating !== undefined) {
            const stars = ratingContainer.querySelectorAll(".star");
            const rating = Number(review.rating);

            stars.forEach((star, index) => {
                if (index < rating) {
                    star.textContent = "★";
                    star.classList.add("filled");
                } else {
                    star.textContent = "☆";
                    star.classList.remove("filled");
                }
            });
        }

        contenedores[2].appendChild(clone);
    });
    deleteEditionWithNoConfirmation();
}

function deleteEditionWithNoConfirmation() {
    if (sessionStorage.getItem("currentReservation")) {
        const reservaToCancel = JSON.parse(sessionStorage.getItem("currentReservation")); 
        const selectedId = localStorage.getItem("selectedActivityId");
        if (reservaToCancel.activity_id !== selectedId) {
            sessionStorage.removeItem("currentReservation");
        }
    }
}

async function dataLoader(jsonUrl){
    let jsonReference = jsonUrl.replace('.json', '').replace('json/', '');
    
    let data;
    
    if (sessionStorage.getItem(jsonReference)) {
        data = JSON.parse(sessionStorage.getItem(jsonReference));
    } else {
        data = await fetch(jsonUrl).then(r => r.json());
        sessionStorage.setItem(jsonReference, JSON.stringify(data));
    } 

    return data;
}

document.addEventListener("contentLoaded", () => {
    document.querySelectorAll(".activity-card").forEach(card => {
        card.addEventListener("click", e => {
            const card = e.target.closest(".activity-card");
            if (!card) return;

            let id, destination;

            if (card.classList.contains("activity")) {
                id = card.querySelector(".activity-id").textContent.trim();
                localStorage.setItem("selectedActivityId", id);
                destination = "activity-information.html";
            }

            else if (card.classList.contains("reservation")) {
                id = card.querySelector("#row-res-id").textContent.trim();

                const reservations = JSON.parse(sessionStorage.getItem("reservations") || "[]");
                const reservation = reservations.find(r => r.code === id);

                sessionStorage.setItem("currentReservation", JSON.stringify(reservation));
                destination = "reservation-information.html";
            }

            window.location.href = destination;
        });
    });
});
