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

    // Simple Form Validation & DataLayer Event
    const leadForm = document.getElementById('contact-form');
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = leadForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'red';
                } else {
                    field.style.borderColor = 'var(--color-border)';
                }
            });
            
            if (isValid) {
                // In a real scenario, you'd send this data via fetch/AJAX
                // e.g. to a webhook or CRM
                
                // Fire GTM Event (Assuming dataLayer exists)
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'lead_form_submit',
                    'formLocation': window.location.pathname
                });
                
                // Show success message (simple implementation)
                const container = leadForm.parentElement;
                container.innerHTML = '<div class="text-center"><h3>תודה רבה!</h3><p>פנייתך התקבלה בהצלחה, ניצור קשר בהקדם.</p></div>';
            }
        });
    }

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
});
