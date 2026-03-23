document.addEventListener('contentLoaded', () => {
    
    window.selectedReservationData = {
        date: null,
        time: null,
        participants: 1
    }

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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day');
            dayEl.innerText = i;

            const dateOfThisDay = new Date(year, month, i);

            if (dateOfThisDay < today) {
                dayEl.classList.add('disabled');
            } else {
                dayEl.addEventListener('click', () => {
                    document.querySelectorAll('.calendar-grid .day:not(.disabled)').forEach(d => d.classList.remove('selected'));
                    dayEl.classList.add('selected');
                
                    updateTimeSlots(dateOfThisDay);

                    const formattedMonth = String(month +1).padStart(2, '0');
                    const formattedDay = String(i).padStart(2, '0');
                    window.selectedReservationData.date = `${year}-${formattedMonth}-${formattedDay}`;
                });
            }

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


    const timePresets = document.querySelectorAll('.preset');

    function updateTimeSlots(selectedDate) {
        const now = new Date();

        const isToday = selectedDate.getFullYear() === now.getFullYear() &&
                        selectedDate.getMonth() === now.getMonth() &&
                        selectedDate.getDate() === now.getDate();

        timePresets.forEach(button => {
            button.classList.remove('disabled', 'active');

            if (isToday) {
                const [slotHour, slotMinute] = button.innerText.split(':').map(Number);
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();

                if (slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute)) {
                    button.classList.add('disabled');
                }
            }
        });

    }

    timePresets.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('disabled')) return;

            timePresets.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            window.selectedReservationData.time = button.innerText;
        });
    });

    const btnMinus = document.getElementById('btnMinus');
    const btnPlus = document.getElementById('btnPlus');
    const peopleInput = document.getElementById('people');

    function updatePeopleCount(change) {
        let currentValue = parseInt(peopleInput.value);
        let newValue = currentValue + change;

        if (newValue >= 1 && newValue <= 20) {
            peopleInput.value = newValue;
            window.selectedReservationData.participants = newValue;
        }
    }

    if (btnMinus && btnPlus && peopleInput) {
        btnMinus.addEventListener('click', () => updatePeopleCount(-1));
        btnPlus.addEventListener('click', () => updatePeopleCount(1));
    }

    updateTimeSlots(new Date());
});