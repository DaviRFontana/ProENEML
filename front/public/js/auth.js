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

    if (!emailInput || !passwordInput || !emailError || !passwordError) {
        return;
    }

    const clearFieldError = (el) => {
        if (!el) return;
        el.textContent = "";
        el.style.animation = "";
    };

    clearFieldError(usernameError);
    clearFieldError(emailError);
    clearFieldError(passwordError);
    if (checkbox) {
        checkbox.classList.remove("auth_form_content_checkbox_error");
        checkbox.style.backgroundColor = "";
    }
    if (button) {
        button.style.animation = "";
    }

    const email = emailInput.value;
    const password = passwordInput.value;
    const hasUsernameField = Boolean(usernameInput && usernameError);
    const isUsernameValid =
        !hasUsernameField || /^[A-Za-z0-9_]{3,32}$/.test(usernameInput.value.trim());
    const isEmailValid = email.includes("@");
    const isPasswordValid = password.length >= 8;
    const isCheckboxValid = checkbox ? checkbox.checked : true;

    if (checkbox) {
        checkbox.classList.remove("auth_form_content_checkbox_error");
        checkbox.style.backgroundColor = "";
    }

    if (hasUsernameField && !isUsernameValid) {
        usernameError.textContent = "Nome de usuário inválido";
        usernameError.style.animation = "fade_in_out_validation_auth 2s ease-in-out";
        setTimeout(() => {
            usernameError.textContent = "";
            usernameError.style.animation = "";
        }, 1990);
    }
    if (!isEmailValid) {
        failures.push({ kind: "email", message: "Email inválido", errorEl: emailError });
    }
    if (!isPasswordValid) {
        passwordError.textContent = "Senha inválida";
        passwordError.style.animation = "fade_in_out_validation_auth 2s ease-in-out";
        setTimeout(() => {
            passwordError.textContent = "";
            passwordError.style.animation = "";
        }, 1990);
    }
    if (!isCheckboxValid && checkbox) {
        checkbox.classList.add("auth_form_content_checkbox_error");
        setTimeout(() => {
            checkbox.classList.remove("auth_form_content_checkbox_error");
        }, 1990);
        setTimeout(() => {
            checkbox.classList.remove("auth_form_content_checkbox_error");
        }, 1990);
        setTimeout(() => {
            checkbox.classList.remove("auth_form_content_checkbox_error");
        }, 1990);
        setTimeout(() => {
            checkbox.classList.remove("auth_form_content_checkbox_error");
        }, 1990);
        setTimeout(() => {
            checkbox.classList.remove("auth_form_content_checkbox_error");
        }, 1990);
        if (button) {
            button.style.animation = "none";
            void button.offsetWidth;
            button.style.animation = "fade_in_out_validation_error_auth 2s ease-in-out";
        }
    }
    if (isEmailValid && isPasswordValid && isCheckboxValid && isUsernameValid && button) {
        button.style.animation = "none";
        void button.offsetWidth;
        button.style.animation = "fade_in_out_validation_success_auth 2s ease-in-out";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth_form_content")?.addEventListener("submit", verify_authentication);

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
