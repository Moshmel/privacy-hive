const fs = require('fs');

const path = 'tikun-13-v2/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Update Hero Section
const heroStart = content.indexOf('<div class="hero-content"');
const heroEnd = content.indexOf('<div class="hero-visual">');
const newHeroContent = `<div class="hero-content" style="text-align: right;">
                <div class="hero-badge-container" style="display: flex; justify-content: flex-start; margin-bottom: 1.5rem;">
                    <div style="display: inline-flex; align-items: center; gap: 0.6rem; border: 1px solid rgba(63, 168, 152, 0.5); border-radius: 50px; padding: 0.5rem 1.5rem; background: rgba(63, 168, 152, 0.15); backdrop-filter: blur(5px); max-width: 100%; box-shadow: 0 4px 15px rgba(63, 168, 152, 0.2);">
                        <i class="fa-solid fa-star" style="color: var(--color-accent); flex-shrink: 0; font-size: 1.1rem;"></i>
                        <span class="hero-badge-text" style="color: white; font-size: 1.1rem; font-weight: 800; letter-spacing: 0.5px;">לבעלי עסקים וחברות</span>
                    </div>
                </div>

                <h1 style="color: white; font-size: clamp(2rem, 3.5vw, 3.5rem); line-height: 1.1; margin-bottom: 1.5rem; font-weight: 900; letter-spacing: -1px;">
                    השיגו עמידה מלאה בתיקון 13 לחוק הגנת הפרטיות <span style="color: var(--color-accent);">והימנעו מקנסות ותביעות</span>
                </h1>
                
                <p style="color: #CBD5E1; font-size: 1.25rem; margin-bottom: 1.5rem; line-height: 1.5; font-weight: 600;">
                    באמצעות שיחת אבחון חינם של 15 דקות (בליווי עורכי דין ומומחי פרטיות מוסמכים)
                </p>
                
                <div style="margin-bottom: 3rem; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; justify-content: flex-start;">
                    <div style="display: flex; align-items: center; gap: 0.6rem; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-right: 3px solid var(--color-accent); padding: 0.6rem 1.2rem; border-radius: 50px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); backdrop-filter: blur(8px);">
                        <div style="width: 32px; height: 32px; background: rgba(63, 168, 152, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--color-accent); font-size: 1rem;"><i class="fa-solid fa-gavel"></i></div>
                        <span style="color: white; font-weight: 700; font-size: 1rem; letter-spacing: 0.5px;">עו"ד מומחה פרטיות</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.6rem; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-right: 3px solid var(--color-accent); padding: 0.6rem 1.2rem; border-radius: 50px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); backdrop-filter: blur(8px);">
                        <div style="width: 32px; height: 32px; background: rgba(63, 168, 152, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--color-accent); font-size: 1rem;"><i class="fa-solid fa-user-shield"></i></div>
                        <span style="color: white; font-weight: 700; font-size: 1rem; letter-spacing: 0.5px;">DPO מוסמך</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.6rem; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-right: 3px solid var(--color-accent); padding: 0.6rem 1.2rem; border-radius: 50px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); backdrop-filter: blur(8px);">
                        <div style="width: 32px; height: 32px; background: rgba(63, 168, 152, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--color-accent); font-size: 1rem;"><i class="fa-solid fa-award"></i></div>
                        <span style="color: white; font-weight: 700; font-size: 1rem; letter-spacing: 0.5px;">תקני אבטחה בינלאומיים</span>
                    </div>
                </div>

                <div class="btn-group hero-btn-group" style="display: flex; gap: 1rem; align-items: center; justify-content: flex-start; flex-wrap: wrap; margin-bottom: 2rem;">
                    <a href="tel:0545445429" class="btn" style="background-color: var(--color-accent); color: white; display: inline-flex; align-items: center; gap: 0.8rem; font-size: 1.1rem; padding: 0.8rem 1.8rem; border-radius: 50px; transition: all 0.3s; text-decoration: none; box-shadow: 0 8px 24px rgba(63, 168, 152, 0.5); font-weight: bold;">
                        <i class="fa-solid fa-phone" style="font-size: 1.1rem;"></i>
                        <span style="direction: ltr; display: inline-block;">התקשרו לייעוץ 054-544-5429</span>
                    </a>
                    <a href="https://wa.me/972545445429?text=%D7%94%D7%99%D7%99%20%D7%91%D7%99%D7%A7%D7%A8%D7%AA%D7%99%20%D7%91%D7%90%D7%AA%D7%A8%20%D7%A9%D7%9C%D7%9A%20privacy-hive%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A7%D7%91%D7%9C%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D" target="_blank" class="btn" style="background-color: white; color: var(--color-primary); display: inline-flex; align-items: center; gap: 0.8rem; font-size: 1.1rem; padding: 0.8rem 1.8rem; border-radius: 50px; transition: all 0.3s; text-decoration: none; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                        <i class="fa-brands fa-whatsapp" style="font-size: 1.3rem;"></i>
                        <span>יצירת קשר בווטסאפ</span>
                    </a>
                </div>
            </div>

            `;
content = content.substring(0, heroStart) + newHeroContent + content.substring(heroEnd);

// Replace Youtube iframe with animated CSS
content = content.replace(
    /<div class="video-container"[\s\S]*?<\/iframe>[\s\S]*?<\/div>/,
    `<div class="video-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; overflow: hidden; pointer-events: none;">
            <style>
                @keyframes heroGradientAnim {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animated-hero-bg {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;
                    background: linear-gradient(-45deg, #0f172a, #1e293b, #11363f, #051a24);
                    background-size: 400% 400%;
                    animation: heroGradientAnim 15s ease infinite;
                }
            </style>
            <div class="animated-hero-bg"></div>
            <div class="video-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%); z-index: 1;"></div>
        </div>`
);


// 2. Update Hero Form Copy
const heroFormStart = content.indexOf('<h3 style="margin-bottom: 0.4rem; text-align: center; color: var(--color-primary); font-size: 1.4rem; font-weight: 800;">ייעוץ ראשוני חינם</h3>');
const heroFormEnd = content.indexOf('<form id="hero-form"');
const newHeroFormText = `<h3 style="margin-bottom: 0.4rem; text-align: center; color: var(--color-primary); font-size: 1.4rem; font-weight: 800;">בדיקת תאימות ללא עלות</h3>
                    <p style="text-align: center; color: #64748B; margin-bottom: 1.5rem; font-weight: 500; font-size: 0.95rem;">קבעו פגישת אבחון קצרה וקבלו תמונת מצב</p>
                    `;
content = content.substring(0, heroFormStart) + newHeroFormText + content.substring(heroFormEnd);

// Replace button text in hero form
content = content.replace(
    /<span>קביעת ייעוץ ראשוני חינם<\/span> <i class="fa-solid fa-arrow-left"><\/i>/g,
    '<span>לחצו לתיאום בדיקת תאימות</span> <i class="fa-solid fa-arrow-left"></i>'
);

// 3. Replace everything from <!-- 2. Self Test --> to <!-- 10. FAQ -->
const bodyReplaceStart = content.indexOf('<!-- 2. Self Test -->');
const bodyReplaceEnd = content.indexOf('<!-- 10. FAQ -->');

const newBodySections = `<!-- 2. Grid Section -->
    <section id="self-test" class="section" style="background-color: #F8FAFC; padding: 5rem 0;">
        <div class="container text-center">
            <h2 style="color: var(--color-primary); margin-bottom: 3.5rem; font-size: 2.5rem; font-weight: 900;">
                מחזיקים באחד מאלה? העסק שלכם חייב <span style="color: var(--color-accent); border-bottom: 3px solid var(--color-accent);">בניהול מידע מסודר:</span>
            </h2>
            
            <div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); text-align: center; gap: 2rem;">
                <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; justify-content: center; border-bottom: 4px solid var(--color-accent); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); padding: 3rem 2rem; border-radius: 16px; background: white; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='none'">
                    <div style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%); color: white; font-size: 2.2rem; flex-shrink: 0; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
                        <i class="fa-solid fa-database"></i>
                    </div>
                    <h3 style="color: var(--color-primary); font-size: 1.3rem; margin: 0; font-weight: 800; line-height: 1.4;">מערכת CRM / ניהול לקוחות</h3>
                </div>
                <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; justify-content: center; border-bottom: 4px solid var(--color-accent); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); padding: 3rem 2rem; border-radius: 16px; background: white; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='none'">
                    <div style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%); color: white; font-size: 2.2rem; flex-shrink: 0; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
                        <i class="fa-solid fa-laptop-file"></i>
                    </div>
                    <h3 style="color: var(--color-primary); font-size: 1.3rem; margin: 0; font-weight: 800; line-height: 1.4;">טפסי לידים באתר</h3>
                </div>
                <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; justify-content: center; border-bottom: 4px solid var(--color-accent); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); padding: 3rem 2rem; border-radius: 16px; background: white; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='none'">
                    <div style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%); color: white; font-size: 2.2rem; flex-shrink: 0; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
                        <i class="fa-solid fa-paper-plane"></i>
                    </div>
                    <h3 style="color: var(--color-primary); font-size: 1.3rem; margin: 0; font-weight: 800; line-height: 1.4;">רשימות דיוור / SMS</h3>
                </div>
                <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; justify-content: center; border-bottom: 4px solid var(--color-accent); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); padding: 3rem 2rem; border-radius: 16px; background: white; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='none'">
                    <div style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%); color: white; font-size: 2.2rem; flex-shrink: 0; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <h3 style="color: var(--color-primary); font-size: 1.3rem; margin: 0; font-weight: 800; line-height: 1.4;">מאגר נתוני עובדים</h3>
                </div>
                <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; justify-content: center; border-bottom: 4px solid var(--color-accent); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); padding: 3rem 2rem; border-radius: 16px; background: white; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='none'">
                    <div style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%); color: white; font-size: 2.2rem; flex-shrink: 0; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
                        <i class="fa-solid fa-handshake"></i>
                    </div>
                    <h3 style="color: var(--color-primary); font-size: 1.3rem; margin: 0; font-weight: 800; line-height: 1.4;">ספקים שחשופים למידע</h3>
                </div>
                <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; justify-content: center; border-bottom: 4px solid var(--color-accent); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); padding: 3rem 2rem; border-radius: 16px; background: white; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='none'">
                    <div style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%); color: white; font-size: 2.2rem; flex-shrink: 0; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
                        <i class="fa-solid fa-credit-card"></i>
                    </div>
                    <h3 style="color: var(--color-primary); font-size: 1.3rem; margin: 0; font-weight: 800; line-height: 1.4;">מערכת סליקה או אזור אישי</h3>
                </div>
            </div>
            
            <div style="margin-top: 4rem; padding: 3rem 2rem; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-top: 4px solid var(--color-primary);">
                <h3 style="color: var(--color-primary); font-size: 1.8rem; font-weight: 900; margin-bottom: 1rem;">סמנתם V אפילו על אחד? כדאי לבדוק איפה אתם עומדים.</h3>
                <p style="color: #64748B; font-size: 1.25rem; margin-bottom: 0;">שיחת אבחון ממוקדת של 15 דקות, שבסופה תצאו עם תמונת מצב ברורה.</p>
            </div>
        </div>
    </section>

    <!-- 3. Steps Section -->
    <section class="section" style="padding: 6rem 0; background-color: white;">
        <div class="container text-center">
            <h2 style="color: var(--color-primary); font-size: 2.5rem; font-weight: 900; margin-bottom: 4rem;">3 שלבים קצרים בדרך לעמידה בחוק</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 3rem; position: relative;">
                <div style="position: relative; z-index: 2; background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-top: 4px solid var(--color-accent);">
                    <div style="width: 70px; height: 70px; background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 100%); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 900; margin: -3.5rem auto 1.5rem auto; box-shadow: 0 8px 20px rgba(63,168,152,0.3); border: 4px solid white;">1</div>
                    <h3 style="color: var(--color-primary); margin-bottom: 1rem; font-size: 1.4rem; font-weight: 800;">מבינים את הסטטוס</h3>
                    <p style="color: #64748B; font-size: 1.1rem; line-height: 1.6;">האם וכמה תיקון 13 חל עליכם.</p>
                </div>
                <div style="position: relative; z-index: 2; background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-top: 4px solid var(--color-accent);">
                    <div style="width: 70px; height: 70px; background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 100%); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 900; margin: -3.5rem auto 1.5rem auto; box-shadow: 0 8px 20px rgba(63,168,152,0.3); border: 4px solid white;">2</div>
                    <h3 style="color: var(--color-primary); margin-bottom: 1rem; font-size: 1.4rem; font-weight: 800;">מזהים סיכונים</h3>
                    <p style="color: #64748B; font-size: 1.1rem; line-height: 1.6;">איתור חורים שחורים בנהלים, בטפסים וב־CRM שלכם.</p>
                </div>
                <div style="position: relative; z-index: 2; background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-top: 4px solid var(--color-accent);">
                    <div style="width: 70px; height: 70px; background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 100%); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 900; margin: -3.5rem auto 1.5rem auto; box-shadow: 0 8px 20px rgba(63,168,152,0.3); border: 4px solid white;">3</div>
                    <h3 style="color: var(--color-primary); margin-bottom: 1rem; font-size: 1.4rem; font-weight: 800;">יוצאים עם תוכנית</h3>
                    <p style="color: #64748B; font-size: 1.1rem; line-height: 1.6;">2 פעולות מיידיות שתוכלו ליישם כבר מחר כדי לצמצם חשיפה משפטית.</p>
                </div>
            </div>
            
            <a href="#contact-section" class="btn" style="margin-top: 4rem; display: inline-flex; align-items: center; gap: 0.8rem; background: var(--color-primary); color: white; padding: 1.2rem 3rem; font-size: 1.25rem; font-weight: bold; border-radius: 50px; text-decoration: none; box-shadow: 0 10px 25px rgba(15,23,42,0.3); transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">
                תאמו אבחון ראשוני (ללא התחייבות) <i class="fa-solid fa-arrow-left"></i>
            </a>
        </div>
    </section>

    <!-- 4. Authority Section -->
    <section class="section section-dark" style="background: var(--color-primary-dark); color: white; padding: 6rem 0;">
        <div class="container">
            <h2 class="text-center" style="margin-bottom: 4rem; font-size: 2.5rem; font-weight: 900;">מומחיות שמחברת משפט, טכנולוגיה ואבטחת מידע</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
                <div style="background: rgba(255,255,255,0.03); padding: 3rem 2.5rem; border-radius: 16px; border-top: 4px solid var(--color-accent); border-right: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); border-left: 1px solid rgba(255,255,255,0.05); box-shadow: 0 15px 30px rgba(0,0,0,0.2);">
                    <div style="width: 80px; height: 80px; background: rgba(63, 168, 152, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--color-accent); margin-bottom: 1.5rem;">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>
                    <h3 style="font-size: 1.8rem; margin-bottom: 1rem; color: white; font-weight: 800;">מאיה ויסמן</h3>
                    <p style="font-size: 1.15rem; line-height: 1.6; color: #CBD5E1;">מומחית פרטיות, ניהול סיכונים וביקורת. (CISA, CPDSE, CDAA). חברת מועצה ב-ISACA ישראל.</p>
                </div>
                <div style="background: rgba(255,255,255,0.03); padding: 3rem 2.5rem; border-radius: 16px; border-top: 4px solid var(--color-accent); border-right: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); border-left: 1px solid rgba(255,255,255,0.05); box-shadow: 0 15px 30px rgba(0,0,0,0.2);">
                    <div style="width: 80px; height: 80px; background: rgba(63, 168, 152, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--color-accent); margin-bottom: 1.5rem;">
                        <i class="fa-solid fa-scale-balanced"></i>
                    </div>
                    <h3 style="font-size: 1.8rem; margin-bottom: 1rem; color: white; font-weight: 800;">עו״ד מוטי כהן</h3>
                    <p style="font-size: 1.15rem; line-height: 1.6; color: #CBD5E1;">עורך דין מומחה לדיני אינטרנט ואבטחת מידע, משמש כממונה פרטיות (DPO) חיצוני מוסמך.</p>
                </div>
            </div>
            
            <div class="text-center" style="margin-top: 4rem;">
                <p style="font-size: 1.3rem; font-weight: 600; display: inline-block; padding: 1.5rem 2.5rem; background: rgba(255,255,255,0.05); border-radius: 50px; border: 1px solid rgba(255,255,255,0.1);">
                    לא רק "מה שכתוב בחוק", אלא <span style="color: var(--color-accent);">איך ליישם אותו בפועל במערכות שלכם</span> בלי לעצור את פעילות העסק.
                </p>
            </div>
        </div>
    </section>
    
    `

content = content.substring(0, bodyReplaceStart) + newBodySections + content.substring(bodyReplaceEnd);

// 4. Update FAQ Content
const faqStart = content.indexOf('<!-- 10. FAQ -->');
const faqEnd = content.indexOf('<!-- Footer -->');

const newFaqSection = `<!-- 5. FAQ Section -->
    <section class="section" style="padding: 6rem 0; background-color: #F8FAFC;">
        <div class="container">
            <h2 class="text-center" style="color: var(--color-primary); margin-bottom: 3rem; font-size: 2.5rem; font-weight: 900;">שאלות נפוצות</h2>
            <div class="faq-container" style="max-width: 800px; margin: 0 auto;">
                <div class="faq-item">
                    <button class="faq-question">
                        <span>האם כל עסק קטן חייב בזה?</span>
                        <span class="faq-icon">+</span>
                    </button>
                    <div class="faq-answer">
                        <div class="faq-answer-inner">
                            <p>כן, אם אתה אוסף מידע מזהה. החוק לא מבדיל בין עסק של אדם אחד לבין תאגיד גדול בכל הנוגע לזכות לפרטיות.</p>
                        </div>
                    </div>
                </div>
                <div class="faq-item">
                    <button class="faq-question">
                        <span>יש לי רק טופס צור קשר באתר, זה נחשב?</span>
                        <span class="faq-icon">+</span>
                    </button>
                    <div class="faq-answer">
                        <div class="faq-answer-inner">
                            <p>בהחלט, גם איסוף לידים בסיסי הכולל שם וטלפון מצריך התאמה לרגולציה ושמירה נאותה על המידע.</p>
                        </div>
                    </div>
                </div>
                <div class="faq-item">
                    <button class="faq-question">
                        <span>כמה זמן לוקח להתאים את העסק?</span>
                        <span class="faq-icon">+</span>
                    </button>
                    <div class="faq-answer">
                        <div class="faq-answer-inner">
                            <p>תלוי בגודל המאגר. בסוף שיחת האבחון הראשונית נדע לתת לכם הערכה מדויקת.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 6. Transparency Block -->
    <section class="section" style="background: white; padding: 5rem 0; border-top: 1px solid #E2E8F0;">
        <div class="container text-center">
            <h2 style="color: var(--color-primary); font-size: 2.2rem; margin-bottom: 1.5rem; font-weight: 900;">100% שקיפות & 0% הפחדות</h2>
            <p style="font-size: 1.25rem; color: #64748B; max-width: 800px; margin: 0 auto; line-height: 1.8;">
                המטרה של האבחון היא לתת לכם תמונת מצב. אם העסק שלכם מכוסה ועובד נכון נגיד לכם את זה מיד ונשחרר אתכם. אנחנו פה כדי לפתור בעיות ולא להמציא אותן. <br><strong style="color: var(--color-primary);">הבדיקה מבוצעת בדיסקרטיות מוחלטת וללא כל התחייבות מצידכם.</strong>
            </p>
        </div>
    </section>

    <!-- 7. Lead Gen Section -->
    <section id="contact-section" class="section section-dark" style="background-color: var(--color-primary); padding: 6rem 0; text-align: center; position: relative;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.05; background-image: radial-gradient(circle at 20px 20px, white 2px, transparent 0); background-size: 40px 40px;"></div>
        <div class="container" style="position: relative; z-index: 2;">
            <h2 style="color: white; font-size: 2.8rem; font-weight: 900; margin-bottom: 1.5rem;">מוכנים לעשות סדר פעם אחת ולתמיד?</h2>
            
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 3rem;">
                <p style="color: white; font-size: 1.4rem; font-weight: 600; margin-bottom: 1.5rem;">קבעו שיחת ייעוץ ראשונית בחינם וקבלו:</p>
                <ul style="list-style: none; padding: 0; color: white; font-size: 1.2rem; text-align: right; margin: 0; background: rgba(0,0,0,0.2); padding: 1.5rem 2.5rem; border-radius: 12px; border-right: 4px solid var(--color-accent);">
                    <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.8rem;"><i class="fa-solid fa-check" style="color: var(--color-accent);"></i> בדיקה מקיפה האם העסק שלכם מוכן לתיקון 13</li>
                    <li style="display: flex; align-items: center; gap: 0.8rem;"><i class="fa-solid fa-check" style="color: var(--color-accent);"></i> 2 צעדים מיידיים שחובה לעשות כבר עכשיו כדי לעמוד בחוק</li>
                </ul>
            </div>
            
            <div style="max-width: 500px; margin: 0 auto; background: white; padding: 3rem 2rem; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
                <form id="contact-form" class="lead-form" style="box-shadow: none; padding: 0;">
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <input type="text" id="fname" name="fname" class="form-control" placeholder="שם מלא *" required style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 0.9rem 1rem;">
                    </div>
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <input type="tel" id="phone" name="phone" class="form-control" placeholder="טלפון *" required style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 0.9rem 1rem;">
                    </div>
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <input type="email" id="email" name="email" class="form-control" placeholder="אימייל *" required style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 0.9rem 1rem;">
                    </div>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <input type="text" id="company" name="company" class="form-control" placeholder="שם העסק *" required style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 0.9rem 1rem;">
                    </div>
                    <input type="hidden" name="reason" value="tikun-13-footer">
                    <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 1.25rem; font-weight: 800; padding: 1rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--color-accent); box-shadow: 0 8px 20px rgba(63,168,152,0.4);">
                        <i class="fa-solid fa-paper-plane"></i> דברו איתי ותאמו לי בדיקה חינם
                    </button>
                    <p style="font-size: 0.85rem; color: #94A3B8; margin-top: 1rem; margin-bottom: 0;">הפרטים שלכם נשמרים בסודיות מלאה ולא יועברו לאיש.</p>
                </form>
            </div>
        </div>
    </section>

    `

content = content.substring(0, faqStart) + newFaqSection + content.substring(faqEnd);

fs.writeFileSync(path, content, 'utf8');
console.log('Update successful');
