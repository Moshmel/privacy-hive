
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

    // Restore state from sessionStorage if it exists
    const savedState = sessionStorage.getItem('privacy_hive_quiz_state');
    if (savedState) {
        try {
            state = JSON.parse(savedState);
            state.isTransitioning = false; // Fix: Ensure it's not locked after refresh
            // Restore visual selected states
            for (const [q, val] of Object.entries(state.answers)) {
                const btn = document.querySelector(`.quiz-option-btn[data-q="${q}"][data-val="${val}"]`);
                if (btn) btn.classList.add('selected');
            }
        } catch(e) {
            console.error("Failed to parse saved state");
        }
    }

    function saveState() {
        sessionStorage.setItem('privacy_hive_quiz_state', JSON.stringify(state));
    }

    const screens = [
        'screen-0', 'screen-1', 'screen-2', 'screen-3', 'screen-4',
        'screen-5', 'screen-5a', 'screen-5b', 'screen-6', 'screen-6a',
        'screen-7', 'screen-7a', 'screen-8', 'screen-9', 'screen-10', 'screen-11',
        'screen-results'
    ];

    // Initialize UI on load
    showScreen(state.path[state.path.length - 1]);

    document.getElementById('btn-start-quiz').addEventListener('click', () => {
        state.path = ['screen-0', 'screen-1']; // Reset path in case they go back to start
        showScreen('screen-1');
        saveState();
    });

    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(state.isTransitioning) return;
            state.isTransitioning = true;
            
            const button = e.currentTarget;
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
                state.isTransitioning = false;
            }, 400); // 400ms delay
        });
    });

    document.getElementById('quiz-back-btn').addEventListener('click', () => {
        if(state.path.length > 1) {
            const current = state.path.pop();
            const prev = state.path[state.path.length - 1];
            showScreen(prev);
            saveState();
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
            saveState();
        }
    }

    function showScreen(id) {
        if (id === 'screen-results') calculateResults();
        
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
        const isSensitive = (state.answers.q3 !== 'basic' || (state.answers.q4 !== 'basic' && state.answers.q4 !== 'none'));
        
        // High level: Over 100k records with sensitive data, or large org with sensitive data
        if ((state.answers.q2 === 'over_100k' && isSensitive) || (state.answers.q1 === '100+' && isSensitive)) {
            return 'high';
        }
        
        // Medium level: Sensitive data OR 10k-100k records OR 11-100 employees
        if (isSensitive || state.answers.q2 === 'over_100k' || state.answers.q2 === '10k_100k' || state.answers.q1 === '11-100') {
            return 'medium';
        }
        
        // Individual level: 1-3 people, not sensitive, <= 10k records (or not sure)
        if (state.answers.q1 === '1-3' && !isSensitive && (state.answers.q2 === 'under_10k' || state.answers.q2 === 'not_sure')) {
            return 'individual';
        }
        
        // Default basic level for regular businesses
        return 'basic';
    }

    function calculateResults() {
        const secLevel = calculateSecurityLevel();
        let issues = [];
        let totalAdminFine = 0;
        
        // 1. Website Privacy Policy (Applies to any business with a website collecting data)
        if (state.answers.q5 === 'yes' && state.answers.q5a === 'yes' && (state.answers.q5b === 'no' || state.answers.q5b === 'not_sure')) {
            issues.push({
                title: 'איסוף המידע באתר דורש הסדרה',
                desc: 'כשאוספים מידע אישי דרך האתר יש חובה חוקית למסור הודעת פרטיות ויידוע לגולשים לגבי השימוש במידע.',
                fineText: 'חשיפה לתביעות: עד 10,000 ₪ ללא הוכחת נזק לכל אדם',
                type: 'lawsuit'
            });
        }
        
        // 2. Marketing / Spam Messages (Applies to any business sending marketing messages)
        if (state.answers.q6 === 'yes' && (state.answers.q6a === 'no' || state.answers.q6a === 'not_sure')) {
            issues.push({
                title: 'הדיוור השיווקי שלכם דורש בדיקה',
                desc: 'שליחת הודעות פרסומיות ללא הסכמה מפורשת ומתועדת מראש מהווה עבירה על חוק הספאם.',
                fineText: 'חשיפה לתביעות: עד 1,000 ₪ לכל הודעה שנשלחה ללא אישור',
                type: 'lawsuit'
            });
        }
        
        // 3. Suppliers Agreement (Applies to non-individual databases)
        if (secLevel !== 'individual' && (state.answers.q7 === 'yes' || state.answers.q7 === 'not_sure') && (state.answers.q7a === 'no' || state.answers.q7a === 'not_sure')) {
            let fine = FINES_CONFIG.admin.supplier_addendum[secLevel] || 0;
            if (fine > 0) {
                totalAdminFine += fine;
                issues.push({
                    title: 'הגישה של הספקים למידע אינה מוסדרת כנדרש',
                    desc: 'ספקים חיצוניים (כמו ענן, CRM, תמיכה ומחשוב) עם גישה למידע מחייבים הסכם אבטחה בכתב.',
                    fineText: `עיצום אפשרי: עד ${fine.toLocaleString()} ₪`,
                    type: 'admin'
                });
            }
        }
        
        // 4. Database Definition Document (Applies to non-individual databases)
        if (secLevel !== 'individual' && (state.answers.q8 === 'no' || state.answers.q8 === 'not_sure')) {
            let fine = FINES_CONFIG.admin.database_definition[secLevel] || 0;
            if (fine > 0) {
                totalAdminFine += fine;
                issues.push({
                    title: 'חסר לכם מסמך הגדרות מאגר',
                    desc: 'המסמך מרכז את סוגי המידע שאתם מחזיקים, מטרות השימוש בו והאופן שבו הוא מנוהל.',
                    fineText: `עיצום אפשרי: עד ${fine.toLocaleString()} ₪`,
                    type: 'admin'
                });
            }
        }
        
        // 5. Security Procedure (Applies to non-individual databases)
        if (secLevel !== 'individual' && (state.answers.q9 === 'no' || state.answers.q9 === 'not_sure')) {
            let fine = FINES_CONFIG.admin.security_procedure[secLevel] || 0;
            if (fine > 0) {
                totalAdminFine += fine;
                issues.push({
                    title: 'חסר לכם נוהל אבטחת מידע',
                    desc: 'נוהל אבטחת המידע מגדיר איך מגנים על המידע ואיך פועלים במקרה של אירוע אבטחה.',
                    fineText: `עיצום אפשרי: עד ${fine.toLocaleString()} ₪`,
                    type: 'admin'
                });
            }
        }
        
        // 6. Employee Training (Applies if not individual and has employees)
        if (secLevel !== 'individual' && state.answers.q4 !== 'none' && (state.answers.q10 === 'no' || state.answers.q10 === 'not_sure')) {
            let fine = FINES_CONFIG.admin.employee_training[secLevel] || 0;
            if (fine > 0) {
                totalAdminFine += fine;
                issues.push({
                    title: 'העובדים לא עברו הדרכת אבטחת מידע כנדרש',
                    desc: 'עובדים עם גישה למידע צריכים לדעת איך לעבוד איתו בצורה בטוחה ולמנוע חשיפה לא מורשית.',
                    fineText: `עיצום אפשרי: עד ${fine.toLocaleString()} ₪`,
                    type: 'admin'
                });
            }
        }
        
        // 7. Access Permissions List (Applies to non-individual databases)
        if (secLevel !== 'individual' && (state.answers.q11 === 'no' || state.answers.q11 === 'not_sure')) {
            let fine = FINES_CONFIG.admin.access_permissions[secLevel] || 0;
            if (fine > 0) {
                totalAdminFine += fine;
                issues.push({
                    title: 'הרשאות הגישה אינן מתועדות כנדרש',
                    desc: 'צריך לדעת מי רשאי לגשת למידע ולאילו מערכות ומידע כל אדם יכול לגשת.',
                    fineText: `עיצום אפשרי: עד ${fine.toLocaleString()} ₪`,
                    type: 'admin'
                });
            }
        }
        
        renderResults(issues, totalAdminFine, secLevel);
    }
    
    function renderResults(issues, totalAdminFine, secLevel) {
        const issuesCountEl = document.getElementById('results-issues-count');
        const fineEl = document.getElementById('results-admin-fine');
        const breakdownTitleEl = document.querySelector('.breakdown-title');
        const gapsContainer = document.getElementById('gaps-list');
        
        gapsContainer.innerHTML = '';
        
        if (issues.length === 0) {
            issuesCountEl.innerText = 'לא מצאנו ליקויים קריטיים!';
            fineEl.innerHTML = '<span>0</span> <span style="font-size: 0.5em;">₪</span>';
            if (breakdownTitleEl) breakdownTitleEl.style.display = 'none';
            gapsContainer.style.display = 'none';
        } else {
            issuesCountEl.innerText = `מצאנו ${issues.length} ליקויים שדורשים טיפול`;
            if (breakdownTitleEl) breakdownTitleEl.style.display = 'block';
            gapsContainer.style.display = 'block';
            
            if (totalAdminFine > 0) {
                fineEl.innerHTML = `<span style="font-size: 0.5em;">עד</span> <span>${totalAdminFine.toLocaleString()}</span> <span style="font-size: 0.5em;">₪</span>`;
            } else {
                // Individual business with only lawsuit / spam risks
                fineEl.innerHTML = `<span style="font-size: 0.45em; color: #DC2626; line-height: 1.2;">חשיפה לתביעות</span>`;
            }
            
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
    }

    // UTM Helper
    function getUTMParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get('utm_source') || '',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
            utm_content: params.get('utm_content') || '',
            utm_term: params.get('utm_term') || '',
            gclid: params.get('gclid') || '',
            fbclid: params.get('fbclid') || ''
        };
    }

    // Handle Quiz Lead Form Submission
    const leadForm = document.getElementById('quiz-lead-form');
    const phoneInput = document.getElementById('quiz_phone');
    const nameInput = document.getElementById('quiz_full_name');
    const emailInput = document.getElementById('quiz_email');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            phoneInput.setCustomValidity('');
            phoneInput.style.borderColor = '#CBD5E1';
        });
    }

    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate Israeli Phone Number
            const cleanPhone = phoneInput.value.replace(/\D/g, '');
            if (!/^05\d{8}$/.test(cleanPhone) && !/^0[23489]\d{7}$/.test(cleanPhone)) {
                phoneInput.setCustomValidity('נא להזין מספר טלפון ישראלי תקין (לדוגמה: 050-1234567)');
                phoneInput.reportValidity();
                phoneInput.style.borderColor = 'red';
                return;
            } else {
                phoneInput.setCustomValidity('');
                phoneInput.style.borderColor = '#CBD5E1';
            }
            
            const submitBtn = document.getElementById('btn-quiz-submit');
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>שולח...</span>';
            submitBtn.disabled = true;

            const secLevel = calculateSecurityLevel();
            const utms = getUTMParams();

            const payload = {
                full_name: nameInput.value.trim(),
                phone: cleanPhone,
                email: emailInput.value.trim(),
                consent_checkbox: document.getElementById('quiz_consent').checked ? 'true' : 'false',
                security_level: secLevel,
                quiz_answers: JSON.stringify(state.answers),
                page_source: 'tikun-13-quiz',
                landing_page_url: window.location.href,
                created_at: new Date().toISOString(),
                ...utms
            };

            const webhookUrl = 'https://hook.eu2.make.com/22305yqwq949g8x3u7djzjv4861q1yyz';

            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.text();
            })
            .then(data => {
                // Fire GTM DataLayer Event
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'lead_form_submit',
                    'formLocation': 'tikun-13-quiz'
                });

                // Fire Direct Google Ads Conversion Event
                if (typeof gtag === 'function') {
                    gtag('event', 'conversion', {
                        'send_to': 'AW-18176010346/9mFVCL38_7IcEOrQ_9pD',
                        'value': 1.0,
                        'currency': 'ILS'
                    });
                }

                // Clear session storage on successful lead
                sessionStorage.removeItem('privacy_hive_quiz_state');

                // Redirect to Thank You Page
                setTimeout(() => {
                    window.location.href = '../thank-you.html';
                }, 500);
            })
            .catch(error => {
                console.error('Error submitting quiz lead:', error);
                submitBtn.innerHTML = 'שגיאה בשליחה, נסו שוב';
                submitBtn.disabled = false;
            });
        });
    }

})();
