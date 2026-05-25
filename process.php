<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer library files
require 'assets/phpmailer/Exception.php';
require 'assets/phpmailer/PHPMailer.php';
require 'assets/phpmailer/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // SMTP Credentials (to be filled by the client)
    $smtpHost = 'mail.privacy-hive.com'; // Change this
    $smtpPort = 465; // Change this (465 for SSL, 587 for TLS)
    $smtpUsername = 'leads@privacy-hive.com'; // Change this
    $smtpPassword = 'YOUR_PASSWORD_HERE'; // Change this
    $smtpEncryption = PHPMailer::ENCRYPTION_SMTPS; // ENCRYPTION_SMTPS for 465, ENCRYPTION_STARTTLS for 587

    // Extract form fields
    $fname = isset($_POST['fname']) ? strip_tags(trim($_POST['fname'])) : '';
    $phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
    $email = isset($_POST['email']) ? strip_tags(trim($_POST['email'])) : '';
    $company = isset($_POST['company']) ? strip_tags(trim($_POST['company'])) : '';
    $reason = isset($_POST['reason']) ? strip_tags(trim($_POST['reason'])) : '';
    $source_page = isset($_POST['source_page']) ? strip_tags(trim($_POST['source_page'])) : 'לא ידוע';

    // Build the email body
    $body = "<h2>התקבל ליד חדש!</h2>";
    $body .= "<p><strong>שם מלא:</strong> {$fname}</p>";
    $body .= "<p><strong>טלפון:</strong> {$phone}</p>";
    
    if (!empty($email)) {
        $body .= "<p><strong>אימייל:</strong> {$email}</p>";
    }
    if (!empty($company)) {
        $body .= "<p><strong>חברה:</strong> {$company}</p>";
    }
    if (!empty($reason)) {
        $body .= "<p><strong>סיבת פנייה / מיקום טופס:</strong> {$reason}</p>";
    }
    
    $body .= "<p><strong>נשלח מהעמוד:</strong> {$source_page}</p>";

    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->CharSet = 'UTF-8';
        $mail->isSMTP();
        $mail->Host       = $smtpHost;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpUsername;
        $mail->Password   = $smtpPassword;
        $mail->SMTPSecure = $smtpEncryption;
        $mail->Port       = $smtpPort;

        // Sender
        // IMPORTANT: The sender address MUST match the authenticated $smtpUsername to prevent spoofing blocks
        $mail->setFrom($smtpUsername, 'Privacy Hive Leads');
        
        // Recipients
        $mail->addAddress('maya@privacy-hive.com', 'Maya Weissman');
        $mail->addAddress('moti@privacy-hive.com', 'Moti Cohen');
        $mail->addAddress('melamed2@gmail.com');

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'התקבל ליד חדש מקמפיין גוגל';
        $mail->Body    = "<div dir='rtl' style='font-family: Arial, sans-serif;'>{$body}</div>";

        $mail->send();
        echo 'Success';
    } catch (Exception $e) {
        // Log the error internally and return generic error message
        error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
        http_response_code(500);
        echo "Error: Message could not be sent.";
    }
} else {
    http_response_code(403);
    echo "Forbidden";
}
?>
