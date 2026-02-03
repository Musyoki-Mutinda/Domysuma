package com.domysuma.website.notification.service;

import com.domysuma.website.notification.events.EmailNotificationEvent;
import com.domysuma.website.notification.model.Notification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

@Service
@Slf4j
public class EmailNotificationService {
    final JavaMailSender javaMailSender;
    final NotificationService notificationService;
    @Value("${spring.mail.username}")
    String from;

    public EmailNotificationService(JavaMailSender javaMailSender, NotificationService notificationService) {
        this.javaMailSender = javaMailSender;
        this.notificationService = notificationService;
    }

    public void sendSimpleEmail(String to, String subject, String message) {

        var mailMessage = new SimpleMailMessage();

        mailMessage.setTo(to);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        mailMessage.setFrom("johndoe@example.com");

        javaMailSender.send(mailMessage);
    }

    public void sendHtmlEmail(EmailNotificationEvent event, Notification notification) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(from, "Domysuma Architects");
            helper.setTo(event.getRecipient());
            helper.setSubject(event.getSubject());
            helper.setText(event.getMessage(), true);

            javaMailSender.send(message);

            notification.setStatus(1);
            notificationService.addSentNotification(notification);
            log.info("Mail sent to: {}, with subject: {}", event.getRecipient(), event.getSubject());

        } catch (MessagingException | UnsupportedEncodingException e) {
            notification.setStatus(0);
            notificationService.addSentNotification(notification);
            log.error("Error sending email: " + e.getMessage());
        }
    }
}
