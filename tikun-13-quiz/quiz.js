/**
 * Privacy Hive - Tikun 13 Exposure Quiz (שאלון חשיפה לתיקון 13)
 * Interactive Quiz Engine - 100% Client-Side Calculations
 */

(function () {
  'use strict';

  // Single Source of Truth for Fines (Managed in Browser)
  let QUIZ_CONFIG = {
    fines: {
      privacy_policy: { medium: 0, high: 0 },
      database_definition: { medium: 40000, high: 160000 },
      security_procedure: { medium: 40000, high: 160000 },
      supplier_addendum: { medium: 80000, high: 320000 },
      employee_training: { medium: 20000, high: 80000 },
      access_permissions: { medium: 20000, high: 80000 }
    }
  };

  // Attempt loading external quiz-config.json if available, fallback to QUIZ_CONFIG above
  fetch('quiz-config.json')
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Config load failed');
    })
    .then(data => {
      if (data && data.fines) {
        QUIZ_CONFIG = data;
      }
    })
    .catch(err => {
      // Using fallback client config
    });

  // State
  const state = {
    currentStepIndex: 0, // 0 = Welcome
    answers: {
      has_website: null,        // "yes" | "no"
      has_crm: null,            // "yes" | "no" | "not_sure"
      privacy_policy: null,     // "yes" | "no" | "not_sure"
      database_definition: null,// "yes" | "no" | "not_sure"
      security_procedure: null, // "yes" | "no" | "not_sure"
      supplier_addendum: null,  // "yes_all" | "partial" | "no" | "not_sure"
      employee_training: null,  // "yes" | "no" | "not_sure"
      access_permissions: null  // "yes" | "partial" | "no" | "not_sure"
    },
    gapsList: [],
    mediumFineTotal: 0,
    highFineTotal: 0,
    riskLevel: 'low', // 'low' | 'medium' | 'high'
    quizStartedTracked: false,
    quizCompletedTracked: false,
    leadFormOpenedTracked: false,
    isSubmitting: false
  };

  // Storage key
  const STORAGE_KEY = 'privacy_hive_tikun13_quiz_state';

  // DOM Elements
  let screens = [];
  let progressBar = null;
  let progressContainer = null;
  let currentQuestionNumEl = null;
  let totalQuestionsNumEl = null;
  let stepBadgeContainer = null;
  let backBtn = null;

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();
    loadSessionState();
    bindEvents();
    updateUI();
  });

  function initDOMElements() {
    screens = Array.from(document.querySelectorAll('.quiz-screen'));
    progressBar = document.getElementById('quiz-progress-bar');
    progressContainer = document.getElementById('quiz-progress-container');
    currentQuestionNumEl = document.getElementById('current-question-num');
    totalQuestionsNumEl = document.getElementById('total-questions-num');
    stepBadgeContainer = document.getElementById('step-badge-container');
    backBtn = document.getElementById('quiz-back-btn');
  }

  function loadSessionState() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.currentStepIndex === 'number') {
          Object.assign(state.answers, parsed.answers || {});
          state.currentStepIndex = parsed.currentStepIndex || 0;
          state.quizStartedTracked = !!parsed.quizStartedTracked;
          state.quizCompletedTracked = !!parsed.quizCompletedTracked;
        }
      }
    } catch (e) {}
  }

  function saveSessionState() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentStepIndex: state.currentStepIndex,
        answers: state.answers,
        quizStartedTracked: state.quizStartedTracked,
        quizCompletedTracked: state.quizCompletedTracked
      }));
    } catch (e) {}
  }

  function clearSessionState() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  // Active steps calculation based on Website answer
  function getActiveQuestionSteps() {
    const questions = [1, 2];
    if (state.answers.has_website === 'yes') {
      questions.push(3); // Add Q3 Privacy Policy
    }
    questions.push(4, 5, 6, 7, 8);
    return questions;
  }

  function getTotalQuestionsCount() {
    return state.answers.has_website === 'yes' ? 8 : 7;
  }

  function getCurrentQuestionIndex() {
    const activeQuestions = getActiveQuestionSteps();
    const idx = activeQuestions.indexOf(state.currentStepIndex);
    return idx >= 0 ? idx + 1 : 0;
  }

  function bindEvents() {
    // Start Quiz button
    const startBtn = document.getElementById('btn-start-quiz');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        goToStep(1);
        trackEvent('quiz_started');
        state.quizStartedTracked = true;
      });
    }

    // Option Buttons click
    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (state.isSubmitting) return;
        const button = e.currentTarget;
        const qKey = button.getAttribute('data-question');
        const answerVal = button.getAttribute('data-value');
        const qNum = parseInt(button.getAttribute('data-qnum'), 10);

        handleAnswerSelect(qKey, answerVal, qNum);
      });
    });

    // Back Button
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        handleBack();
      });
    }

    // Results screen CTA -> Lead form
    const ctaResultsBtn = document.getElementById('btn-results-cta');
    if (ctaResultsBtn) {
      ctaResultsBtn.addEventListener('click', () => {
        goToStep(10); // Lead Form
        if (!state.leadFormOpenedTracked) {
          trackEvent('lead_form_opened');
          state.leadFormOpenedTracked = true;
        }
      });
    }

    // Toggle Gaps details button
    const toggleGapsBtn = document.getElementById('btn-toggle-gaps');
    const gapsListContainer = document.getElementById('gaps-list-container');
    if (toggleGapsBtn && gapsListContainer) {
      toggleGapsBtn.addEventListener('click', () => {
        const isHidden = gapsListContainer.classList.contains('hidden');
        if (isHidden) {
          gapsListContainer.classList.remove('hidden');
          toggleGapsBtn.classList.add('expanded');
          toggleGapsBtn.querySelector('.toggle-icon').style.transform = 'rotate(180deg)';
        } else {
          gapsListContainer.classList.add('hidden');
          toggleGapsBtn.classList.remove('expanded');
          toggleGapsBtn.querySelector('.toggle-icon').style.transform = 'rotate(0deg)';
        }
      });
    }

    // Restart Quiz buttons
    document.querySelectorAll('.btn-restart-quiz').forEach(btn => {
      btn.addEventListener('click', () => {
        restartQuiz();
      });
    });

    // Lead Form Submit
    const leadForm = document.getElementById('quiz-lead-form');
    if (leadForm) {
      leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitLead();
      });
    }
  }

  function handleAnswerSelect(qKey, answerVal, qNum) {
    state.answers[qKey] = answerVal;

    // Track GTM question answered event (No PII)
    trackEvent('quiz_question_answered', {
      question_number: qNum,
      question_key: qKey,
      answer_key: answerVal
    });

    // Special logic for Has Website (Q1)
    if (qKey === 'has_website' && answerVal === 'no') {
      state.answers.privacy_policy = null;
    }

    const activeQuestions = getActiveQuestionSteps();
    const currentActiveIdx = activeQuestions.indexOf(state.currentStepIndex);

    saveSessionState();

    if (currentActiveIdx >= 0 && currentActiveIdx < activeQuestions.length - 1) {
      const nextStepIndex = activeQuestions[currentActiveIdx + 1];
      goToStep(nextStepIndex);
    } else {
      // Completed all questions -> Go to Results Screen
      calculateResults();
      goToStep(9);
    }
  }

  function handleBack() {
    if (state.currentStepIndex <= 0) return;

    if (state.currentStepIndex === 9) {
      const activeQuestions = getActiveQuestionSteps();
      goToStep(activeQuestions[activeQuestions.length - 1]);
      return;
    }

    if (state.currentStepIndex === 10) {
      goToStep(9);
      return;
    }

    if (state.currentStepIndex === 11) {
      goToStep(0);
      return;
    }

    const activeQuestions = getActiveQuestionSteps();
    const currentActiveIdx = activeQuestions.indexOf(state.currentStepIndex);

    if (currentActiveIdx > 0) {
      goToStep(activeQuestions[currentActiveIdx - 1]);
    } else {
      goToStep(0);
    }
  }

  function goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= screens.length) return;

    screens.forEach(screen => {
      screen.classList.add('hidden');
      screen.classList.remove('active');
    });

    state.currentStepIndex = stepIndex;
    const targetScreen = screens[stepIndex];
    if (targetScreen) {
      targetScreen.classList.remove('hidden');
      void targetScreen.offsetWidth;
      targetScreen.classList.add('active');
    }

    saveSessionState();
    updateUI();

    const container = document.getElementById('quiz-main-card');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (stepIndex === 9) {
      calculateResults();
      renderResults();
      if (!state.quizCompletedTracked) {
        trackEvent('quiz_completed', {
          risk_level: state.riskLevel,
          gaps_count: state.gapsList.length,
          medium_fine_total: state.mediumFineTotal,
          high_fine_total: state.highFineTotal
        });
        state.quizCompletedTracked = true;
        saveSessionState();
      }
    }
  }

  function updateUI() {
    const isQuestionScreen = state.currentStepIndex >= 1 && state.currentStepIndex <= 8;
    const totalQuestions = getTotalQuestionsCount();
    const currentQIdx = getCurrentQuestionIndex();

    if (progressContainer) {
      if (isQuestionScreen) {
        progressContainer.style.display = 'block';
        if (progressBar) {
          const pct = Math.round((currentQIdx / totalQuestions) * 100);
          progressBar.style.width = `${pct}%`;
        }
      } else {
        progressContainer.style.display = 'none';
      }
    }

    if (stepBadgeContainer) {
      if (isQuestionScreen) {
        stepBadgeContainer.style.display = 'flex';
        if (currentQuestionNumEl) currentQuestionNumEl.textContent = currentQIdx;
        if (totalQuestionsNumEl) totalQuestionsNumEl.textContent = totalQuestions;
      } else {
        stepBadgeContainer.style.display = 'none';
      }
    }

    if (backBtn) {
      if (state.currentStepIndex > 0 && state.currentStepIndex < 11) {
        backBtn.style.display = 'inline-flex';
      } else {
        backBtn.style.display = 'none';
      }
    }

    screens.forEach((screen, screenIdx) => {
      if (screenIdx >= 1 && screenIdx <= 8) {
        screen.querySelectorAll('.quiz-option-btn').forEach(btn => {
          const qKey = btn.getAttribute('data-question');
          const val = btn.getAttribute('data-value');
          if (state.answers[qKey] === val) {
            btn.classList.add('selected');
          } else {
            btn.classList.remove('selected');
          }
        });
      }
    });
  }

  // 100% Client-Side Results Calculation
  function calculateResults() {
    const gaps = [];
    let medTotal = 0;
    let highTotal = 0;
    const fines = QUIZ_CONFIG.fines || {};

    // Q3: Privacy Policy (Only if Website == "yes")
    if (state.answers.has_website === 'yes') {
      if (state.answers.privacy_policy === 'no' || state.answers.privacy_policy === 'not_sure') {
        gaps.push({
          key: 'privacy_policy',
          title: 'מדיניות הפרטיות באתר אינה תקינה או מעודכנת',
          displayTitle: 'מדיניות הפרטיות באתר אינה תקינה'
        });
        medTotal += (fines.privacy_policy ? fines.privacy_policy.medium : 0);
        highTotal += (fines.privacy_policy ? fines.privacy_policy.high : 0);
      }
    }

    // Q4: Database Definition
    if (state.answers.database_definition === 'no' || state.answers.database_definition === 'not_sure') {
      gaps.push({
        key: 'database_definition',
        title: state.answers.database_definition === 'not_sure'
          ? 'לא ידוע אם קיים מסמך הגדרות מאגר'
          : 'אין מסמך הגדרות מאגר תקין',
        displayTitle: 'אין מסמך הגדרות מאגר'
      });
      medTotal += (fines.database_definition ? fines.database_definition.medium : 40000);
      highTotal += (fines.database_definition ? fines.database_definition.high : 160000);
    }

    // Q5: Security Procedure
    if (state.answers.security_procedure === 'no' || state.answers.security_procedure === 'not_sure') {
      gaps.push({
        key: 'security_procedure',
        title: state.answers.security_procedure === 'not_sure'
          ? 'לא ידוע אם קיים נוהל אבטחת מידע'
          : 'אין נוהל אבטחת מידע תקין',
        displayTitle: 'אין נוהל אבטחת מידע'
      });
      medTotal += (fines.security_procedure ? fines.security_procedure.medium : 40000);
      highTotal += (fines.security_procedure ? fines.security_procedure.high : 160000);
    }

    // Q6: Supplier Addendum
    if (state.answers.supplier_addendum === 'partial' || state.answers.supplier_addendum === 'no' || state.answers.supplier_addendum === 'not_sure') {
      let gapTitle = 'הספקים אינם חתומים על נספח אבטחת מידע';
      if (state.answers.supplier_addendum === 'partial') gapTitle = 'רק חלק מהספקים חתומים על נספח אבטחת מידע';
      gaps.push({
        key: 'supplier_addendum',
        title: gapTitle,
        displayTitle: 'הספקים אינם חתומים'
      });
      medTotal += (fines.supplier_addendum ? fines.supplier_addendum.medium : 80000);
      highTotal += (fines.supplier_addendum ? fines.supplier_addendum.high : 320000);
    }

    // Q7: Employee Training
    if (state.answers.employee_training === 'no' || state.answers.employee_training === 'not_sure') {
      gaps.push({
        key: 'employee_training',
        title: state.answers.employee_training === 'not_sure'
          ? 'לא ידוע אם העובדים עברו הדרכה'
          : 'העובדים לא עברו הדרכת אבטחת מידע',
        displayTitle: 'העובדים לא עברו הדרכה'
      });
      medTotal += (fines.employee_training ? fines.employee_training.medium : 20000);
      highTotal += (fines.employee_training ? fines.employee_training.high : 80000);
    }

    // Q8: Access Permissions
    if (state.answers.access_permissions === 'partial' || state.answers.access_permissions === 'no' || state.answers.access_permissions === 'not_sure') {
      let gapTitle = 'הרשאות הגישה למידע אינן מתועדות';
      if (state.answers.access_permissions === 'partial') gapTitle = 'הרשאות הגישה מנוהלות ומתועדות רק באופן חלקי';
      gaps.push({
        key: 'access_permissions',
        title: gapTitle,
        displayTitle: 'הרשאות הגישה אינן מתועדות'
      });
      medTotal += (fines.access_permissions ? fines.access_permissions.medium : 20000);
      highTotal += (fines.access_permissions ? fines.access_permissions.high : 80000);
    }

    state.gapsList = gaps;
    state.mediumFineTotal = medTotal;
    state.highFineTotal = highTotal;

    const gapCount = gaps.length;
    if (gapCount <= 1) {
      state.riskLevel = 'low';
    } else if (gapCount <= 3) {
      state.riskLevel = 'medium';
    } else {
      state.riskLevel = 'high';
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('he-IL').format(amount);
  }

  function renderResults() {
    const riskTitleEl = document.getElementById('results-risk-title');
    const amountBoxEl = document.getElementById('results-amount-box');
    const gapsCountEl = document.getElementById('results-gaps-count');
    const toggleGapsBtn = document.getElementById('btn-toggle-gaps');
    const gapsListContainer = document.getElementById('gaps-list-container');
    const gapsUlEl = document.getElementById('gaps-ul-list');
    const ctaBtn = document.getElementById('btn-results-cta');

    const gapCount = state.gapsList.length;

    // 0 Gaps State
    if (gapCount === 0) {
      if (riskTitleEl) {
        riskTitleEl.innerHTML = '<span class="risk-badge risk-low">רמת החשיפה שלכם: נמוכה</span>';
      }
      if (amountBoxEl) {
        amountBoxEl.innerHTML = '<p class="amount-text">לפי התשובות, לא נמצאו פערים משמעותיים.</p>';
      }
      if (gapsCountEl) {
        gapsCountEl.style.display = 'none';
      }
      if (toggleGapsBtn) {
        toggleGapsBtn.style.display = 'none';
      }
      if (gapsListContainer) {
        gapsListContainer.classList.add('hidden');
      }
      if (ctaBtn) {
        ctaBtn.textContent = 'לקבלת בדיקה מקצועית';
      }
      return;
    }

    // 1+ Gaps State
    if (riskTitleEl) {
      let riskLabel = 'גבוהה';
      let riskClass = 'risk-high';

      if (state.riskLevel === 'low') {
        riskLabel = 'נמוכה';
        riskClass = 'risk-low';
      } else if (state.riskLevel === 'medium') {
        riskLabel = 'בינונית';
        riskClass = 'risk-medium';
      }

      riskTitleEl.innerHTML = `החשיפה שלכם לקנסות: <span class="risk-badge ${riskClass}">${riskLabel}</span>`;
    }

    if (amountBoxEl) {
      if (state.highFineTotal > 0) {
        amountBoxEl.innerHTML = `<p class="amount-text">לפי התשובות, אתם חשופים לקנסות של עד <strong>${formatCurrency(state.highFineTotal)} ₪</strong>.</p>`;
      } else {
        amountBoxEl.innerHTML = `<p class="amount-text">נמצא פער שעלול לחשוף את העסק לקנסות ולתביעות.</p>`;
      }
    }

    if (gapsCountEl) {
      gapsCountEl.style.display = 'block';
      let gapTextDesc = 'שדורשים טיפול.';
      if (state.riskLevel === 'low') gapTextDesc = 'שרצוי לבדוק.';
      gapsCountEl.textContent = `נמצאו ${gapCount} פערים ${gapTextDesc}`;
    }

    if (ctaBtn) {
      ctaBtn.textContent = 'בדקו איך מצמצמים את החשיפה';
    }

    if (toggleGapsBtn) {
      toggleGapsBtn.style.display = 'inline-flex';
    }

    if (gapsUlEl) {
      gapsUlEl.innerHTML = '';
      state.gapsList.forEach(gap => {
        const li = document.createElement('li');
        li.textContent = gap.displayTitle || gap.title;
        gapsUlEl.appendChild(li);
      });
    }
  }

  function restartQuiz() {
    state.currentStepIndex = 0;
    state.answers = {
      has_website: null,
      has_crm: null,
      privacy_policy: null,
      database_definition: null,
      security_procedure: null,
      supplier_addendum: null,
      employee_training: null,
      access_permissions: null
    };
    state.gapsList = [];
    state.mediumFineTotal = 0;
    state.highFineTotal = 0;
    state.riskLevel = 'low';
    state.quizStartedTracked = false;
    state.quizCompletedTracked = false;
    state.leadFormOpenedTracked = false;
    state.isSubmitting = false;

    clearSessionState();

    const errorEl = document.getElementById('lead-form-error');
    if (errorEl) errorEl.style.display = 'none';

    goToStep(0);
  }

  function getTrackingParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};

    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
    keys.forEach(k => {
      const val = urlParams.get(k);
      if (val && val !== 'undefined' && val !== 'null') {
        params[k] = val;
      }
    });

    const cookies = document.cookie.split(';');
    cookies.forEach(c => {
      const [name, val] = c.trim().split('=');
      if (name === '_fbp' && val && val !== 'undefined' && val !== 'null') params._fbp = val;
      if (name === '_fbc' && val && val !== 'undefined' && val !== 'null') params._fbc = val;
    });

    params.page_url = window.location.href;
    if (document.referrer) params.referrer = document.referrer;

    return params;
  }

  function submitLead() {
    if (state.isSubmitting) return;

    const fnameInput = document.getElementById('lead_fname');
    const phoneInput = document.getElementById('lead_phone');
    const companyInput = document.getElementById('lead_company');
    const emailInput = document.getElementById('lead_email');
    const honeypotInput = document.getElementById('lead_website_hp');
    const submitBtn = document.getElementById('btn-submit-lead');
    const errorEl = document.getElementById('lead-form-error');

    if (errorEl) errorEl.style.display = 'none';

    const fname = fnameInput ? fnameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const company = companyInput ? companyInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const hp = honeypotInput ? honeypotInput.value.trim() : '';

    if (!fname || !phone || !company) {
      showFormError('אנא מלאו את כל שדות החובה.');
      return;
    }

    if (phone.length < 8) {
      showFormError('אנא הזינו מספר טלפון תקין.');
      return;
    }

    const consentInput = document.getElementById('lead_consent');
    if (consentInput && !consentInput.checked) {
      showFormError('יש לאשר את מדיניות הפרטיות כדי להמשיך.');
      return;
    }

    state.isSubmitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.querySelector('.btn-text').textContent = 'שולח...';
    }

    // Send pre-calculated results directly from client
    const tracking = getTrackingParams();
    const payload = new FormData();

    payload.append('action', 'submit_tikun13_quiz');
    payload.append('fname', fname);
    payload.append('phone', phone);
    payload.append('company', company);
    payload.append('email', email);
    payload.append('website_hp', hp);

    // Send calculated client-side values directly
    let riskLevelLabel = 'גבוהה';
    if (state.riskLevel === 'low') riskLevelLabel = 'נמוכה';
    if (state.riskLevel === 'medium') riskLevelLabel = 'בינונית';

    payload.append('risk_level', riskLevelLabel);
    payload.append('gaps_count', state.gapsList.length);
    payload.append('medium_fine_total', state.mediumFineTotal);
    payload.append('high_fine_total', state.highFineTotal);
    payload.append('gaps_list_json', JSON.stringify(state.gapsList.map(g => g.title)));
    payload.append('answers_json', JSON.stringify(state.answers));
    payload.append('source_page', window.location.href);

    Object.keys(tracking).forEach(k => {
      payload.append(k, tracking[k]);
    });

    fetch('../process.php', {
      method: 'POST',
      body: payload
    })
      .then(res => {
        if (!res.ok) throw new Error('HTTP error ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data && data.success) {
          trackEvent('lead_form_submit', { formLocation: 'tikun-13-quiz' });

          if (typeof gtag === 'function') {
            gtag('event', 'conversion', {
              'send_to': 'AW-18176010346/9mFVCL38_7IcEOrQ_9pD',
              'value': 1.0,
              'currency': 'ILS'
            });
          }

          clearSessionState();
          goToStep(11); // Thank you screen
        } else {
          showFormError('לא הצלחנו לשלוח את הפרטים. נסו שוב.');
        }
      })
      .catch(err => {
        console.error('Submission error:', err);
        showFormError('לא הצלחנו לשלוח את הפרטים. נסו שוב.');
      })
      .finally(() => {
        state.isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          submitBtn.querySelector('.btn-text').textContent = 'חזרו אליי';
        }
      });
  }

  function showFormError(msg) {
    const errorEl = document.getElementById('lead-form-error');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    }
  }

  function trackEvent(eventName, eventData = {}) {
    window.dataLayer = window.dataLayer || [];
    const eventPayload = Object.assign({ event: eventName }, eventData);
    window.dataLayer.push(eventPayload);
  }

})();
