document.addEventListener('DOMContentLoaded', function() {

    // --- Gestione Accordion (Home Page) ---
    const accordions = document.querySelectorAll('.accordion-header');
    if (accordions.length > 0) {
        accordions.forEach(acc => {
            acc.addEventListener('click', function() {
                this.classList.toggle('active');
                const panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                }
            });
        });

        const percorsoLink = document.getElementById('percorso-link');
        const percorsoSection = document.getElementById('percorso');
        percorsoLink.addEventListener('click', function(e) {
            e.preventDefault();
            percorsoSection.style.display = 'block';
            // Apri il primo accordion di default
            if(!accordions.classList.contains('active')) {
                accordions.click();
            }
            percorsoSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Gestione Tabs (Pagina Allenamento) ---
    window.openMonth = function(evt, monthName) {
        const tabcontent = document.querySelectorAll('.tab-content');
        tabcontent.forEach(tab => tab.style.display = 'none');
        
        const tablinks = document.querySelectorAll('.tab-link');
        tablinks.forEach(link => link.className = link.className.replace(' active', ''));
        
        document.getElementById(monthName).style.display = 'block';
        evt.currentTarget.className += ' active';
    }

    // --- Gestione Checklist e Timer (Pagina Allenamento) ---
    const workoutTables = document.querySelectorAll('.workout-table');
    if (workoutTables.length > 0) {
        workoutTables.forEach(table => {
            const tableId = table.id;
            const checkboxes = table.querySelectorAll('.exercise-check');
            
            // Carica stato checkboxes da localStorage
            checkboxes.forEach((box, index) => {
                const isChecked = localStorage.getItem(`${tableId}-check-${index}`) === 'true';
                box.checked = isChecked;
                if (isChecked) {
                    box.closest('tr').classList.add('completed');
                }
                
                box.addEventListener('change', function() {
                    localStorage.setItem(`${tableId}-check-${index}`, this.checked);
                    this.closest('tr').classList.toggle('completed', this.checked);
                });
            });

            // Gestione Timer
            const timerIcons = table.querySelectorAll('.timer-icon');
            const timerOverlay = document.getElementById('timer-overlay');
            const timerDisplay = document.getElementById('timer-display');
            let timerInterval;

            timerIcons.forEach(icon => {
                icon.addEventListener('click', function() {
                    const time = parseInt(this.dataset.time, 10);
                    startTimer(time);
                });
            });
            
            function startTimer(duration) {
                let timer = duration;
                clearInterval(timerInterval);
                timerOverlay.style.display = 'flex';

                timerInterval = setInterval(() => {
                    let minutes = parseInt(timer / 60, 10);
                    let seconds = parseInt(timer % 60, 10);

                    minutes = minutes < 10? "0" + minutes : minutes;
                    seconds = seconds < 10? "0" + seconds : seconds;

                    timerDisplay.textContent = minutes + ":" + seconds;

                    if (--timer < 0) {
                        clearInterval(timerInterval);
                        timerOverlay.style.display = 'none';
                        // Aggiungi un suono o una vibrazione se possibile/desiderato
                    }
                }, 1000);
            }
            
            timerOverlay.addEventListener('click', function() {
                 clearInterval(timerInterval);
                 this.style.display = 'none';
            });
        });
    }

    // --- Gestione Form Progressi ---
    const progressForm = document.getElementById('progress-form');
    if (progressForm) {
        // Carica dati da localStorage
        const savedData = JSON.parse(localStorage.getItem('progressData')) |

| {};
        Object.keys(savedData).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = savedData[key];
            }
        });

        progressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(progressForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            localStorage.setItem('progressData', JSON.stringify(data));
            
            const feedback = document.getElementById('save-feedback');
            feedback.textContent = 'Progressi salvati con successo!';
            setTimeout(() => { feedback.textContent = ''; }, 3000);
        });
    }
});
