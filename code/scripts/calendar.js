document.addEventListener('contentLoaded', () => {
    const monthDisplay = document.getElementById('monthDisplay');
    const calendarGrid = document.getElementById('calendarGrid');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    if (!monthDisplay || !calendarGrid) return;

    let currentDate = new Date();

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const monthNames = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];

        monthDisplay.innerText = `${monthNames[month]} ${year}`;

        const dayNamesHTML = `
            <div class="day-name">M</div>
            <div class="day-name">T</div>
            <div class="day-name">W</div>
            <div class="day-name">T</div>
            <div class="day-name">F</div>
            <div class="day-name">S</div>
            <div class="day-name">S</div>
        `;
        calendarGrid.innerHTML = dayNamesHTML;

        const firstDayIndex = new Date(year, month, 1).getDay();
        const adjFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < adjFirstDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('day', 'empty');
            calendarGrid.appendChild(emptyDiv);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day');
            dayEl.innerText = i;

            dayEl.addEventListener('click', () => {
                document.querySelectorAll('.calendar-grid .day').forEach(d => d.classList.remove('selected'));
                dayEl.classList.add('selected');
            });

            calendarGrid.appendChild(dayEl);
        }
    }

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
});