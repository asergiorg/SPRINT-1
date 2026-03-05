document.addEventListener('DOMContentLoaded', async () => {
    await cargarEstructura();
    await cargarContenidoDinamico();
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

async function cargarContenidoDinamico() {
    // Detectar página actual
    const pagina = window.location.pathname.split('/').pop().replace('.html', '');
    
    // Buscar contenedores dinámicos
    const contenedores = document.querySelectorAll('[data-content-id]');
    
    for (const contenedor of contenedores) {
        // Cargar JSON correspondiente
        var jsonReference = contenedor.dataset.json;
        jsonReference = jsonReference.replace('.json', ''); // Eliminar extensión para cargar desde sessionStorage
        jsonReference = jsonReference.replace('json/', '');
        
        let data;
        if (sessionStorage.getItem(jsonReference)) {
            data = JSON.parse(sessionStorage.getItem(jsonReference));
        } else {
            jsonUrl = contenedor.dataset.json;
            data = await fetch(jsonUrl).then(r => r.json());

            // Guardar para futuras visitas
            sessionStorage.setItem(jsonReference, JSON.stringify(data));
        } 


        const templateUrl = contenedor.dataset.template;

        var items = data;

        // Si estamos en la página de detalle, filtrar por ID 
        if (pagina === "activity-information") { 
            const selectedId = localStorage.getItem("selectedActivityId"); 
            items = items.filter(item => item.id == selectedId);
        }


        // Cargar template
        const templateNode = await cargarTemplate(templateUrl);

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
