package com.domysuma.website.notification.listeners;

import com.domysuma.website.notification.data.enums.NotificationTypeEnum;
import com.domysuma.website.notification.events.EmailNotificationEvent;
import com.domysuma.website.notification.events.GenericNotificationEvent;
import com.domysuma.website.user.model.User;
import com.domysuma.website.user.repository.UserRepo;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class ForgotPasswordListener {
    final UserRepo userRepo;
    final TemplateEngine templateEngine;
    final ApplicationEventPublisher publisher;

    public ForgotPasswordListener(UserRepo userRepo, TemplateEngine templateEngine, ApplicationEventPublisher publisher) {
        this.userRepo = userRepo;
        this.templateEngine = templateEngine;
        this.publisher = publisher;
    }

    @EventListener
    @Async("threadPoolTaskExecutor")
    public void handleEvent(GenericNotificationEvent<?> event) {
        if (event.getNotificationType().equals(NotificationTypeEnum.FORGOT_PASSWORD.name())) {
            final String sourceTable = "users";
            String type = event.getNotificationType();
            var user = (User) event.getAffectedObject();
            var otp = user.getUserPasswordReset().getToken();
            Context context = new Context();
            context.setVariable("username", user.getFirstName());
            context.setVariable("email", user.getEmail());
            context.setVariable("baseFrontEndUrl", "/set-password");
            context.setVariable("token", otp);

            String message = templateEngine.process("forgot-password-template", context);
            String recipient = user.getEmail();
            String subject = "Set your new password";
            publisher.publishEvent(new EmailNotificationEvent(this, type, message, recipient, subject, user, sourceTable, user.getId().toString()));
        }
    }
}
