document.addEventListener('DOMContentLoaded', async () => {
    await cargarEstructura();
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

document.addEventListener("contentLoaded", async () => {

    const pagina = window.location.pathname.split('/').pop().replace('.html', '');
    if (pagina !== "index") return;

    const data = await fetch("json/activities.json").then(r => r.json());

    const templateNode = await cargarTemplate("templates/activity1.html");

    const sliderArticles = document.querySelectorAll(".slider .activity");

    data.slice(0, sliderArticles.length).forEach((item, index) => {
        const article = sliderArticles[index];
        const clone = templateNode.cloneNode(true);

        Object.keys(item).forEach(prop => {
            const target = clone.querySelector(`[data-field="${prop}"]`);
            if (target) {
                if (target.tagName === "IMG") {
                    target.src = item[prop];
                } else {
                    target.textContent = item[prop];
                }
            }
        });

        article.appendChild(clone);
    });

    document.querySelectorAll(".activity").forEach(card => {
        card.addEventListener("click", e => {
            const activity = e.target.closest(".activity");
            const id = activity.querySelector(".activity-id").textContent.trim();
            localStorage.setItem("selectedActivityId", id);
            window.location.href = "activity-information.html";
        });
    });

});