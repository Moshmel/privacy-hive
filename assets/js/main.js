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

                // Send to PHP processing file
                // Using an absolute path or relative depending on host. Assuming process.php is at root.
                // We determine root by checking if we are in a subdirectory
                const processUrl = window.location.pathname.includes('/') && window.location.pathname.split('/').length > 2 
                                   ? '../process.php' 
                                   : 'process.php';

                fetch(processUrl, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(data => {
                    // Fire GTM Event
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        'event': 'lead_form_submit',
                        'formLocation': window.location.pathname
                    });
                    
                    // Redirect to Thank You Page
                    const thankYouUrl = window.location.pathname.includes('/') && window.location.pathname.split('/').length > 2 
                                       ? '../thank-you.html' 
                                       : 'thank-you.html';
                    window.location.href = thankYouUrl;
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
});
