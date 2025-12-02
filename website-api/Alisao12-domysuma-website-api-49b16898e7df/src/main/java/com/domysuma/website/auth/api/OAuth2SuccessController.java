import com.domysuma.website.user.model.User;
import com.domysuma.website.user.service.UserService;
import com.domysuma.website.auth.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Controller
@RequestMapping("/oauth2")
public class OAuth2SuccessController {

    private final UserService userService;
    private final AuthService authService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public OAuth2SuccessController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping("/success")
    public void oauth2Success(
            @AuthenticationPrincipal OAuth2User oAuthUser,
            HttpServletResponse response) throws IOException {

        // 1️⃣ Prevent null principal
        if (oAuthUser == null) {
            log.error("OAuth2User is null — Spring Security did NOT attach the authenticated user.");
            response.sendError(500, "Google login failed: Missing OAuth user data");
            return;
        }

        log.info("OAuth2 login success. Attributes received: {}", oAuthUser.getAttributes());

        // 2️⃣ Extract attributes safely
        String email = oAuthUser.getAttribute("email");
        String fullName = oAuthUser.getAttribute("name");
        String avatarUrl = oAuthUser.getAttribute("picture");

        if (email == null) {
            log.error("Google OAuth did not return an email. Attributes: {}", oAuthUser.getAttributes());
            response.sendError(400, "Google login failed: Missing email permission");
            return;
        }

        // 3️⃣ Ensure user exists or create it
        User user = userService.findOrCreateGoogleUser(email, fullName, avatarUrl);

        // 4️⃣ Generate tokens with unified JWT subject (id,username)
        String access = authService.generateToken(user);
        String refresh = authService.generateRefreshToken(user);

        // 5️⃣ Redirect to frontend with valid tokens
        String redirectUrl = frontendUrl
                + "/login-success?access=" + URLEncoder.encode(access, StandardCharsets.UTF_8)
                + "&refresh=" + URLEncoder.encode(refresh, StandardCharsets.UTF_8)
                + "&name=" + URLEncoder.encode(fullName, StandardCharsets.UTF_8)
                + "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8);

        log.info("Redirecting user to frontend: {}", redirectUrl);

        response.sendRedirect(redirectUrl);
    }
}
