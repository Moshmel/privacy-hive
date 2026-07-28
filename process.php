<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Disable raw PHP error display to clients
ini_set('display_errors', '0');
error_reporting(E_ALL);

require 'assets/phpmailer/Exception.php';
require 'assets/phpmailer/PHPMailer.php';
require 'assets/phpmailer/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $is_quiz_ajax = (isset($_POST['action']) && $_POST['action'] === 'submit_tikun13_quiz') || 
                    (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') ||
                    (isset($_POST['answers_json']));

    // Anti-spam Honeypot Check
    if (!empty($_POST['website_hp'])) {
        if ($is_quiz_ajax) {
            header('Content-Type: application/json');
            echo json_encode(['success' => true]); // Silent fail for bots
            exit;
        } else {
            echo 'Success';
            exit;
        }
    }

    // SMTP Credentials
    $config = require 'config.php';
    $smtpHost = $config['smtp_host'];
    $smtpPort = $config['smtp_port'];
    $smtpUsername = $config['smtp_user'];
    $smtpPassword = $config['smtp_pass'];
    $smtpEncryption = PHPMailer::ENCRYPTION_SMTPS;

    // Extract & sanitize basic fields
    $fname = isset($_POST['fname']) ? mb_substr(strip_tags(trim($_POST['fname'])), 0, 100) : '';
    $phone = isset($_POST['phone']) ? mb_substr(strip_tags(trim($_POST['phone'])), 0, 30) : '';
    $email = isset($_POST['email']) ? mb_substr(strip_tags(trim($_POST['email'])), 0, 150) : '';
    $company = isset($_POST['company']) ? mb_substr(strip_tags(trim($_POST['company'])), 0, 150) : '';
    $reason = isset($_POST['reason']) ? mb_substr(strip_tags(trim($_POST['reason'])), 0, 200) : '';
    $source_page = isset($_POST['source_page']) ? mb_substr(strip_tags(trim($_POST['source_page'])), 0, 300) : 'לא ידוע';

    // Validation
    if (empty($fname) || empty($phone)) {
        if ($is_quiz_ajax) {
            header('Content-Type: application/json', true, 400);
            echo json_encode(['success' => false, 'error' => 'אנא מלאו את שדות החובה']);
            exit;
        } else {
            http_response_code(400);
            echo 'Error: Required fields missing';
            exit;
        }
    }

    // Is Quiz Submission?
    $answers_raw = isset($_POST['answers_json']) ? $_POST['answers_json'] : null;

    if ($answers_raw) {
        // --- QUIZ LEAD HANDLING ---
        $answers = json_decode($answers_raw, true);
        if (!is_array($answers)) {
            $answers = [];
        }

        $risk_level_text = isset($_POST['risk_level']) ? strip_tags($_POST['risk_level']) : 'לא ידוע';
        $gaps_count = isset($_POST['gaps_count']) ? (int)$_POST['gaps_count'] : 0;
        $medium_total = isset($_POST['medium_fine_total']) ? (int)$_POST['medium_fine_total'] : 0;
        $high_total = isset($_POST['high_fine_total']) ? (int)$_POST['high_fine_total'] : 0;

        $gaps_list_raw = isset($_POST['gaps_list_json']) ? $_POST['gaps_list_json'] : '[]';
        $gaps_list = json_decode($gaps_list_raw, true);
        if (!is_array($gaps_list)) $gaps_list = [];

        $has_website = isset($answers['has_website']) ? $answers['has_website'] : 'no';
        $has_crm = isset($answers['has_crm']) ? $answers['has_crm'] : 'no';

        // Helper label map
        $val_map = [
            'yes' => 'כן',
            'no' => 'לא',
            'not_sure' => 'לא בטוחים',
            'yes_all' => 'כן, כולם',
            'partial' => 'חלקית / רק חלק'
        ];

        // Format Email Body
        $body = "<h2 style='color:#20283F;'>התקבל ליד חדש משאלון חשיפה לתיקון 13!</h2>";
        
        $body .= "<h3 style='color:#34789A;'>פרטי המשתמש</h3>";
        $body .= "<p><strong>שם מלא:</strong> {$fname}</p>";
        $body .= "<p><strong>טלפון:</strong> {$phone}</p>";
        $body .= "<p><strong>שם העסק:</strong> {$company}</p>";
        if (!empty($email)) {
            $body .= "<p><strong>אימייל:</strong> {$email}</p>";
        }

        $body .= "<hr style='border:0; border-top:1px solid #E2E8F0; margin:15px 0;'>";
        $body .= "<h3 style='color:#34789A;'>תוצאות החישוב והחשיפה (מחושב בדפדפן)</h3>";
        $body .= "<p><strong>רמת החשיפה:</strong> {$risk_level_text}</p>";
        $body .= "<p><strong>מספר פערים שנמצאו:</strong> {$gaps_count}</p>";
        $body .= "<p><strong>חשיפה לקנסות ברמה גבוהה:</strong> " . number_format($high_total) . " ₪</p>";
        $body .= "<p><strong>חשיפה לקנסות ברמה בינונית:</strong> " . number_format($medium_total) . " ₪</p>";

        if (!empty($gaps_list)) {
            $body .= "<h4 style='color:#DC2626;'>רשימת הפערים שנמצאו:</h4><ul>";
            foreach ($gaps_list as $g) {
                $body .= "<li>" . htmlspecialchars($g) . "</li>";
            }
            $body .= "</ul>";
        } else {
            $body .= "<p style='color:#059669;'><strong>לא נמצאו פערים משמעותיים בשאלון.</strong></p>";
        }

        $body .= "<hr style='border:0; border-top:1px solid #E2E8F0; margin:15px 0;'>";
        $body .= "<h3 style='color:#34789A;'>תשובות המשתמש בשאלון</h3>";
        $body .= "<ul>";
        $body .= "<li><strong>אתר אינטרנט:</strong> " . ($val_map[$has_website] ?? $has_website) . "</li>";
        $body .= "<li><strong>מערכת CRM:</strong> " . ($val_map[$has_crm] ?? $has_crm) . "</li>";
        if ($has_website === 'yes') {
            $body .= "<li><strong>מדיניות פרטיות:</strong> " . ($val_map[$answers['privacy_policy'] ?? ''] ?? ($answers['privacy_policy'] ?? 'לא נענה')) . "</li>";
        }
        $body .= "<li><strong>מסמך הגדרות מאגר:</strong> " . ($val_map[$answers['database_definition'] ?? ''] ?? ($answers['database_definition'] ?? 'לא נענה')) . "</li>";
        $body .= "<li><strong>נוהל אבטחת מידע:</strong> " . ($val_map[$answers['security_procedure'] ?? ''] ?? ($answers['security_procedure'] ?? 'לא נענה')) . "</li>";
        $body .= "<li><strong>נספח ספקים:</strong> " . ($val_map[$answers['supplier_addendum'] ?? ''] ?? ($answers['supplier_addendum'] ?? 'לא נענה')) . "</li>";
        $body .= "<li><strong>הדרכת עובדים:</strong> " . ($val_map[$answers['employee_training'] ?? ''] ?? ($answers['employee_training'] ?? 'לא נענה')) . "</li>";
        $body .= "<li><strong>תיעוד הרשאות:</strong> " . ($val_map[$answers['access_permissions'] ?? ''] ?? ($answers['access_permissions'] ?? 'לא נענה')) . "</li>";
        $body .= "</ul>";

        // Append Tracking & Meta Params
        $tracking_keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', '_fbp', '_fbc', 'referrer'];
        $tracking_info = [];
        foreach ($tracking_keys as $tk) {
            if (isset($_POST[$tk]) && !empty($_POST[$tk]) && $_POST[$tk] !== 'undefined' && $_POST[$tk] !== 'null') {
                $tracking_info[$tk] = mb_substr(strip_tags(trim($_POST[$tk])), 0, 200);
            }
        }

        $body .= "<hr style='border:0; border-top:1px solid #E2E8F0; margin:15px 0;'>";
        $body .= "<h3 style='color:#34789A;'>נתוני מקור ומעקב</h3>";
        $body .= "<p><strong>תאריך ושעה:</strong> " . date('d/m/Y H:i:s') . "</p>";
        $body .= "<p><strong>כתובת העמוד:</strong> {$source_page}</p>";
        
        if (!empty($tracking_info)) {
            $body .= "<ul>";
            foreach ($tracking_info as $k => $v) {
                $body .= "<li><strong>{$k}:</strong> {$v}</li>";
            }
            $body .= "</ul>";
        }

        $email_subject = "ליד חדש משאלון תיקון 13 - {$company} ({$fname})";

    } else {
        // --- STANDARD FORM HANDLING ---
        $body = "<h2>התקבל ליד חדש!</h2>";
        $body .= "<p><strong>שם מלא:</strong> {$fname}</p>";
        $body .= "<p><strong>טלפון:</strong> {$phone}</p>";
        if (!empty($email)) {
            $body .= "<p><strong>אימייל:</strong> {$email}</p>";
        }
        if (!empty($company)) {
            $body .= "<p><strong>חברה / עסק:</strong> {$company}</p>";
        }
        if (!empty($reason)) {
            $body .= "<p><strong>סיבת פנייה:</strong> {$reason}</p>";
        }
        $body .= "<p><strong>נשלח מהעמוד:</strong> {$source_page}</p>";

        $email_subject = 'התקבל ליד חדש מקמפיין גוגל';
    }

    // Send Mail via PHPMailer
    $mail = new PHPMailer(true);

    try {
        $mail->CharSet = 'UTF-8';
        $mail->isSMTP();
        $mail->Host       = $smtpHost;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpUsername;
        $mail->Password   = $smtpPassword;
        $mail->SMTPSecure = $smtpEncryption;
        $mail->Port       = $smtpPort;

        $mail->setFrom($smtpUsername, 'Privacy Hive Leads');
        
        $mail->addAddress('maya@privacy-hive.com', 'Maya Weissman');
        $mail->addAddress('moti@privacy-hive.com', 'Moti Cohen');
        $mail->addAddress('melamed2@gmail.com');

        $mail->isHTML(true);
        $mail->Subject = $email_subject;
        $mail->Body    = "<div dir='rtl' style='font-family: Arial, sans-serif; line-height: 1.6;'>{$body}</div>";

        $mail->send();

        if ($is_quiz_ajax) {
            header('Content-Type: application/json');
            echo json_encode(['success' => true]);
            exit;
        } else {
            echo 'Success';
            exit;
        }
    } catch (Exception $e) {
        error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
        
        if ($is_quiz_ajax) {
            header('Content-Type: application/json', true, 500);
            echo json_encode(['success' => false, 'error' => 'לא הצלחנו לשלוח את הפרטים. נסו שוב.']);
            exit;
        } else {
            http_response_code(500);
            echo "Error: Message could not be sent.";
            exit;
        }
    }
} else {
    http_response_code(403);
    echo "Forbidden";
}
?>
