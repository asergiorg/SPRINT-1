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
    // Buscar contenedores dinámicos
    const contenedores = document.querySelectorAll('[data-content-id]');
    if (!contenedores.length) return;
    
    for (const contenedor of contenedores) {
        const items = await dataLoader(contenedor.dataset.json);
        
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

    let data = await dataLoader(contenedores[0].dataset.json);

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
