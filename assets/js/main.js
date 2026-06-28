document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open items
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Form Submission Logic (AJAX)
    const leadForms = document.querySelectorAll('.lead-form');
    
    leadForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'red';
                } else {
                    field.style.borderColor = 'var(--color-border)';
                }
            });
            
            if (isValid) {
                // Change button text to indicate loading
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> שולח...';
                submitBtn.disabled = true;

                // Gather data
                const formData = new FormData(form);
                formData.append('source_page', window.location.pathname);

                // Convert to plain object for JSON submission (safest for Make.com)
                const dataObj = {};
                formData.forEach((value, key) => {
                    dataObj[key] = value;
                });

                // Send to Make.com Webhook (excluding tikun-13 which has its own webhook)
                let webhookUrl = 'https://hook.eu2.make.com/wh2lk7yndr8ucxc33hw9d8pxciwcb57a';
                if (window.location.pathname.includes('tikun-13')) {
                    webhookUrl = 'https://hook.eu2.make.com/wrk781ymtplke4lopluidshmxbyjpwyd';
                }

                fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataObj)
                })
                .then(response => response.text())
                .then(data => {
                    // Fire GTM Event
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        'event': 'lead_form_submit',
                        'formLocation': window.location.pathname
                    });
                    
                    // Redirect to Thank You Page with delay to allow GTM to fire
                    const thankYouUrl = window.location.pathname.includes('/') && window.location.pathname.split('/').length > 2 
                                       ? '../thank-you.html' 
                                       : 'thank-you.html';
                    setTimeout(() => {
                        window.location.href = thankYouUrl;
                    }, 500);
                })
                .catch(error => {
                    console.error('Error:', error);
                    submitBtn.innerHTML = 'שגיאה בשליחה, נסה שוב';
                    submitBtn.disabled = false;
                });
            }
        });
    });

    // Track CTA Clicks
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'cta_click',
                'buttonText': this.innerText,
                'pagePath': window.location.pathname
            });
        });
    });

    // Track Phone Calls Clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'click_phone',
                'phoneNumber': this.getAttribute('href').replace('tel:', ''),
                'pagePath': window.location.pathname
            });
        });
    });

    // Track WhatsApp Clicks
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(link => {
        link.addEventListener('click', function() {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'click_whatsapp',
                'pagePath': window.location.pathname
            });
        });
    });
});
