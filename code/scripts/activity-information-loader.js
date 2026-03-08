document.addEventListener('DOMContentLoaded', async () => {
    await cargarEstructura();
    await cargarDatosActivityInformation();
    document.dispatchEvent(new Event('contentLoaded'));
});

async function cargarEstructura() {
    const pagina = window.location.pathname.split('/').pop().replace('.html', '');
    document.body.appendChild(await cargarTemplate('templates/header.html'));
    document.body.appendChild(await cargarTemplate(`templates/${pagina}-body.html`));
    document.body.appendChild(await cargarTemplate('templates/footer.html'));
}

async function cargarTemplate(url) {
    const response = await fetch(url);
    const html = await response.text();
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content;
}

async function cargarDatosActivityInformation() {

    const contenedores = document.querySelectorAll("[data-content-id]");
    if (!contenedores.length) return;

    let jsonReference = contenedores[0].dataset.json;
    jsonReference = jsonReference.replace(".json", "");
    jsonReference = jsonReference.replace("json/", "");

    let data;
    if (sessionStorage.getItem(jsonReference)) {
        data = JSON.parse(sessionStorage.getItem(jsonReference));
    } else {
        const jsonUrl = contenedores[0].dataset.json;
        data = await fetch(jsonUrl).then(r => r.json());
        sessionStorage.setItem(jsonReference, JSON.stringify(data));
    }

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
}