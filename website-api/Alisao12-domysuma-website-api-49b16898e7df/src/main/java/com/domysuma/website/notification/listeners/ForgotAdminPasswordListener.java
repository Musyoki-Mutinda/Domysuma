package com.domysuma.website.notification.listeners;

import com.domysuma.website.notification.data.enums.NotificationTypeEnum;
import com.domysuma.website.notification.events.EmailAdminNotificationEvent;
import com.domysuma.website.notification.events.GenericNotificationEvent;
import com.domysuma.website.user.model.AdminUser;
import com.domysuma.website.user.repository.AdminUserRepo;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class ForgotAdminPasswordListener {
    final AdminUserRepo userRepo;
    final TemplateEngine templateEngine;
    final ApplicationEventPublisher publisher;

    public ForgotAdminPasswordListener(AdminUserRepo userRepo, TemplateEngine templateEngine, ApplicationEventPublisher publisher) {
        this.userRepo = userRepo;
        this.templateEngine = templateEngine;
        this.publisher = publisher;
    }

    @EventListener
    @Async("threadPoolTaskExecutor")
    public void handleEvent(GenericNotificationEvent<?> event) {
        if (event.getNotificationType().equals(NotificationTypeEnum.FORGOT_ADMIN_PASSWORD.name())) {
            final String sourceTable = "admin_users";
            String type = event.getNotificationType();
            var user = (AdminUser) event.getAffectedObject();
            var otp = user.getUserPasswordReset().getToken();
            Context context = new Context();
            context.setVariable("username", user.getFirstName());
            context.setVariable("email", user.getEmail());
            context.setVariable("baseFrontEndUrl", "/set-password");
            context.setVariable("token", otp);

            String message = templateEngine.process("forgot-password-template", context);
            String recipient = user.getEmail();
            String subject = "Set your new password";
            publisher.publishEvent(new EmailAdminNotificationEvent(this, type, message, recipient, subject, user, sourceTable, user.getId().toString()));
        }
    }
}
