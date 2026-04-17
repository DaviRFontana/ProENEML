function verify_authentication(e) {
    e.preventDefault();

    const button = document.getElementById("auth_form_content_submit_button");
    const usernameInput = document.getElementById("auth_form_content_username_input");
    const usernameError = document.getElementById("auth_form_content_username_title_error");
    const emailInput = document.getElementById("auth_form_content_email_input");
    const emailError = document.getElementById("auth_form_content_email_title_error");
    const passwordInput = document.getElementById("auth_form_content_password_input");
    const passwordError = document.getElementById("auth_form_content_password_title_error");
    const checkbox = document.getElementById("auth_form_content_terms_checkbox");

    const clearFieldError = (el) => {
        if (!el) return;
        el.textContent = "";
        el.style.animation = "";
    };

    clearFieldError(usernameError);
    clearFieldError(emailError);
    clearFieldError(passwordError);

    const email = emailInput.value;
    const password = passwordInput.value;
    const hasUsernameField = Boolean(usernameInput && usernameError);
    const isUsernameValid =
        !hasUsernameField || /^[A-Za-z0-9_]{3,32}$/.test(usernameInput.value.trim());
    const isEmailValid = email.includes("@");
    const isPasswordValid = password.length >= 8;
    const isCheckboxValid = checkbox ? checkbox.checked : true;

    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isCheckboxValid) {
        button.style.animation = "fade_in_out_validation_error_auth 1.5s ease-in-out both alternate";
        setTimeout(() => {
            button.style.animation = " fade_in_rest_auth 0s";
        }, 1500);
    }

    if (!isUsernameValid) {
        usernameError.textContent = "Nome de usuário inválido";
        usernameError.style.animation = "fade_in_out_validation_auth 1.5s ease-in-out both alternate";
        setTimeout(() => {
            clearFieldError(usernameError);
        }, 1500);
    }
    if (!isEmailValid) {
        emailError.textContent = "Email inválido";
        emailError.style.animation = "fade_in_out_validation_auth 1.5s ease-in-out both alternate";
        setTimeout(() => {
            clearFieldError(emailError);
        }, 1500);
    }
    if (!isPasswordValid) {
        passwordError.textContent = "Senha inválida";
        passwordError.style.animation = "fade_in_out_validation_auth 1.5s ease-in-out both alternate";
        setTimeout(() => {
            clearFieldError(passwordError);
        }, 1500);
    }
    if (!isCheckboxValid && isPasswordValid) {
        passwordError.textContent = "Você deve concordar com os termos";
        passwordError.style.animation = "fade_in_out_validation_auth 1.5s ease-in-out both alternate";
        setTimeout(() => {
            clearFieldError(passwordError);
        }, 1500);
    }

    if (isUsernameValid && isEmailValid && isPasswordValid && isCheckboxValid) {
        button.style.animation = "fade_in_out_validation_success_auth 0.5s ease-in-out both alternate";
        setTimeout(() => {
            button.style.animation = " fade_in_rest_auth 0s";
        }, 500);
        return;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("auth_form_content_password_input");
    const passwordToggle = document.getElementById("auth_form_content_password_toggle");
    if (passwordInput && passwordToggle) {
        passwordToggle.addEventListener("click", () => {
            const showing = passwordInput.type === "text";
            passwordInput.type = showing ? "password" : "text";
            passwordToggle.textContent = showing ? "Mostrar" : "Ocultar";
            passwordToggle.setAttribute("aria-pressed", showing ? "false" : "true");
            passwordToggle.setAttribute(
                "aria-label",
                showing ? "Mostrar senha digitada" : "Ocultar senha digitada"
            );
        });
    }
});
