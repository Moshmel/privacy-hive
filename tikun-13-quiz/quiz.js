
(function() {
    const FINES_CONFIG = {
        admin: {
            database_definition: { individual: 0, basic: 40000, medium: 80000, high: 160000 },
            security_procedure:  { individual: 0, basic: 40000, medium: 80000, high: 160000 },
            supplier_addendum:   { individual: 0, basic: 80000, medium: 160000, high: 320000 },
            employee_training:   { individual: 0, basic: 20000, medium: 40000, high: 80000 },
            access_permissions:  { individual: 0, basic: 20000, medium: 40000, high: 80000 }
        }
    };

    let state = {
        answers: {},
        path: ['screen-0']
    };

    const screens = [
        'screen-0', 'screen-1', 'screen-2', 'screen-3', 'screen-4',
        'screen-5', 'screen-5a', 'screen-5b', 'screen-6', 'screen-6a',
        'screen-7', 'screen-7a', 'screen-8', 'screen-9', 'screen-10', 'screen-11',
        'screen-results'
    ];

    document.getElementById('btn-start-quiz').addEventListener('click', () => {
        state.path.push('screen-1');
        showScreen('screen-1');
    });

    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target;
            const q = button.getAttribute('data-q');
            const val = button.getAttribute('data-val');
            state.answers[q] = val;
            
            // Visual feedback
            const siblings = button.parentElement.querySelectorAll('.quiz-option-btn');
            siblings.forEach(b => b.classList.remove('selected'));
            button.classList.add('selected');
            
            // Delay before moving next
            setTimeout(() => {
                handleNext(q, val);
            }, 400); // 400ms delay
        });
    });

    document.getElementById('quiz-back-btn').addEventListener('click', () => {
        if(state.path.length > 1) {
            const current = state.path.pop();
            const prev = state.path[state.path.length - 1];
            showScreen(prev);
        }
    });

    function handleNext(q, val) {
        let next = '';
        switch(q) {
            case 'q1': next = 'screen-2'; break;
            case 'q2': next = 'screen-3'; break;
            case 'q3': next = 'screen-4'; break;
            case 'q4': next = 'screen-5'; break;
            case 'q5': next = (val === 'yes') ? 'screen-5a' : 'screen-6'; break;
            case 'q5a': next = 'screen-5b'; break;
            case 'q5b': next = 'screen-6'; break;
            case 'q6': next = (val === 'yes') ? 'screen-6a' : 'screen-7'; break;
            case 'q6a': next = 'screen-7'; break;
            case 'q7': next = (val === 'yes' || val === 'not_sure') ? 'screen-7a' : 'screen-8'; break;
            case 'q7a': next = 'screen-8'; break;
            case 'q8': next = 'screen-9'; break;
            case 'q9': 
                if(state.answers.q4 === 'none') {
                    next = 'screen-11';
                } else {
                    next = 'screen-10';
                }
                break;
            case 'q10': next = 'screen-11'; break;
            case 'q11': 
                calculateResults();
                next = 'screen-results'; 
                break;
        }
        if(next) {
            state.path.push(next);
            showScreen(next);
        }
    }

    function showScreen(id) {
        document.querySelectorAll('.quiz-screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        
        const topControls = document.getElementById('quiz-top-controls');
        const bottomControls = document.getElementById('quiz-bottom-controls');
        const progContainer = document.getElementById('quiz-progress-container');
        
        if(id === 'screen-0' || id === 'screen-results') {
            topControls.style.display = 'none';
            bottomControls.style.display = 'none';
            progContainer.style.display = 'none';
        } else {
            topControls.style.display = 'flex';
            bottomControls.style.display = 'block';
            progContainer.style.display = 'block';
            
            let total = 11;
            if(state.answers.q5 === 'no') total -= 2;
            if(state.answers.q6 === 'no') total -= 1;
            if(state.answers.q7 === 'no') total -= 1;
            if(state.answers.q4 === 'none') total -= 1;
            
            document.getElementById('quiz-progress-bar').style.width = ((state.path.length - 1) / total * 100) + '%';
        }
    }

    function calculateSecurityLevel() {
        let level = 'basic';
        let sensitive = false;
        
        if (state.answers.q3 !== 'basic' || (state.answers.q4 !== 'basic' && state.answers.q4 !== 'none')) {
            sensitive = true;
        }
        
        if (state.answers.q2 === 'over_100k') {
            level = sensitive ? 'high' : 'medium';
        } else if (state.answers.q2 === '10k_100k') {
            level = sensitive ? 'high' : 'medium';
        } else {
            if (sensitive) {
                level = 'medium';
            } else if (state.answers.q1 === '1-3' && state.answers.q2 !== 'not_sure') {
                level = 'individual';
            }
        }
        
        return level;
    }

    function calculateResults() {
        const secLevel = calculateSecurityLevel();
        let issues = [];
        let totalAdminFine = 0;
        
        // Website Privacy Policy
        if (state.answers.q5 === 'yes' && state.answers.q5a === 'yes' && (state.answers.q5b === 'no' || state.answers.q5b === 'not_sure')) {
            issues.push({
                title: 'איסוף המידע באתר דורש הסדרה',
                desc: 'כשאוספים מידע אישי צריך למסור לאדם את היידוע הנדרש לגבי איסוף והשימוש במידע.',
                fineText: 'כל אדם שהמידע שלו נאסף ללא היידוע הנדרש עשוי לתבוע עד 10,000 ₪ ללא הוכחת נזק.',
                type: 'lawsuit'
            });
        }
        
        // Spam Law
        if (state.answers.q6 === 'yes' && (state.answers.q6a === 'no' || state.answers.q6a === 'not_sure')) {
            issues.push({
                title: 'הדיוור השיווקי שלכם דורש בדיקה',
                desc: 'שליחת הודעות פרסומיות כפופה לכללים לגבי הסכמה ושימוש בפרטי הנמענים.',
                fineText: 'עד 1,000 ₪ לכל הודעה שנשלחה בניגוד לחוק.',
                type: 'lawsuit'
            });
        }
        
        // Supplier
        if ((state.answers.q7 === 'yes' || state.answers.q7 === 'not_sure') && (state.answers.q7a === 'no' || state.answers.q7a === 'not_sure')) {
            let fine = FINES_CONFIG.admin.supplier_addendum[secLevel] || 0;
            totalAdminFine += fine;
            issues.push({
                title: 'הגישה של הספקים למידע אינה מוסדרת כנדרש',
                desc: 'ספקים עם גישה למידע צריכים להיות כפופים להסדרה שמגדירה מה מותר להם לעשות עם המידע ואיך עליהם להגן עליו.',
                fineText: `עיצום אפשרי: עד ${fine.toLocaleString()} ₪`,
                type: 'admin'
            });
        }
        
        // Database definition
        if (state.answers.q8 === 'no' || state.answers.q8 === 'not_sure') {
            let fine = FINES_CONFIG.admin.database_definition[secLevel] || 0;
            totalAdminFine += fine;
            issues.push({
                title: 'חסר לכם מסמך הגדרות מאגר',
                desc: 'המסמך מרכז את סוגי המידע שאתם מחזיקים, מטרות השימוש בו והאופן שבו הוא מנוהל.',
                fineText: `עיצום אפשרי: עד ${fine.toLocaleString()} ₪`,
                type: 'admin'
            });
        }
        
        // Security procedure
        if (state.answers.q9 === 'no' || state.answers.q9 === 'not_sure') {
            let fine = FINES_CONFIG.admin.security_procedure[secLevel] || 0;
            totalAdminFine += fine;
            issues.push({
                title: 'חסר לכם נוהל אבטחת מידע',
                desc: 'נוהל אבטחת המידע מגדיר איך מגנים על המידע ואיך פועלים במקרה של אירוע אבטחה.',
                fineText: `עיצום אפשרי: עד ${fine.toLocaleString()} ₪`,
                type: 'admin'
            });
        }
        
        // Training
        if (state.answers.q4 !== 'none' && (state.answers.q10 === 'no' || state.answers.q10 === 'not_sure')) {
            let fine = FINES_CONFIG.admin.employee_training[secLevel] || 0;
            totalAdminFine += fine;
            issues.push({
                title: 'העובדים לא עברו הדרכת אבטחת מידע כנדרש',
                desc: 'עובדים עם גישה למידע צריכים לדעת איך לעבוד איתו בצורה בטוחה ולמנוע חשיפה לא מורשית.',
                fineText: `עיצום אפשרי: עד ${fine.toLocaleString()} ₪`,
                type: 'admin'
            });
        }
        
        // Permissions
        if (state.answers.q11 === 'no' || state.answers.q11 === 'not_sure') {
            let fine = FINES_CONFIG.admin.access_permissions[secLevel] || 0;
            totalAdminFine += fine;
            issues.push({
                title: 'הרשאות הגישה אינן מתועדות כנדרש',
                desc: 'צריך לדעת מי רשאי לגשת למידע ולאילו מערכות ומידע כל אדם יכול לגשת.',
                fineText: `עיצום אפשרי: עד ${fine.toLocaleString()} ₪`,
                type: 'admin'
            });
        }
        
        renderResults(issues, totalAdminFine, secLevel);
    }
    
    function renderResults(issues, totalAdminFine, secLevel) {
        document.getElementById('results-issues-count').innerText = `מצאנו ${issues.length} ליקויים שדורשים טיפול`;
        document.getElementById('results-admin-fine').innerText = `עד ${totalAdminFine.toLocaleString()} ₪`;
        
        const gapsContainer = document.getElementById('gaps-list');
        gapsContainer.innerHTML = '';
        
        issues.forEach(issue => {
            const card = document.createElement('div');
            card.className = 'gap-card';
            card.innerHTML = `
                <h3>${issue.title}</h3>
                <p>${issue.desc}</p>
                <div class="fine ${issue.type === 'lawsuit' ? 'lawsuit' : ''}">${issue.fineText}</div>
            `;
            gapsContainer.appendChild(card);
        });
    }

})();
