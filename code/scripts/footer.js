document.addEventListener('click', (event) => {
    const header = event.target.closest('.footer-col h3');

    if (header && window.innerHeight <= 767) {
        const parentCol = header.parentElement;
        const allCols = document.querySelectorAll('.footer-col');

        allCols.forEach(col => {
            if (col !== parentCol) {
                col.classList.remove('active');
            }
        });

        parentCol.classList.toggle('active');
    }
});