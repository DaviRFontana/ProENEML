const ANIM_FIELD = "fade_in_out_validation_auth 1.5s ease-in-out both alternate";
const ANIM_BTN_ERR = "fade_in_out_validation_error_auth 1.5s ease-in-out both alternate";
const ANIM_BTN_OK = "fade_in_out_validation_success_auth 0.5s ease-in-out both alternate";
const ANIM_RESET = "none";
const FIELD_ERR_MS = 1500;
const BTN_ERR_MS = 1500;
const BTN_OK_MS = 500;

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_OK = /^[A-Za-z0-9_]{3,32}$/;

function clearError(el) {
    if (!el) return;
    el.textContent = "";
    el.style.animation = ANIM_RESET;
}

function flashFieldError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.style.animation = ANIM_FIELD;
    setTimeout(() => clearError(el), FIELD_ERR_MS);
}

function resetButtonAnim(btn, ms) {
    setTimeout(() => {
        btn.style.animation = ANIM_RESET;
    }, ms);
}

function verify_authentication(e) {
    e.preventDefault();

    const button = document.getElementById("auth_form_content_submit_button");
    const usernameInput = document.getElementById("auth_form_content_username_input");
    const usernameError = document.getElementById("auth_form_content_username_title_error");
    const emailInput = document.getElementById("auth_form_content_email_input");
    const emailError = document.getElementById("auth_form_content_email_title_error");
    const passwordInput = document.getElementById("auth_form_content_password_input");
    const passwordError = document.getElementById("auth_form_content_password_title_error");
    const termsError = document.getElementById("auth_form_content_terms_error");
    const checkbox = document.getElementById("auth_form_content_terms_checkbox");

    clearError(usernameError);
    clearError(emailError);
    clearError(passwordError);
    clearError(termsError);

    const email = emailInput?.value ?? "";
    const password = passwordInput?.value ?? "";
    const hasUser = Boolean(usernameInput && usernameError);
    const userOk = !hasUser || USER_OK.test(usernameInput.value.trim());
    const emailOk = EMAIL_OK.test(email);
    const passOk = password.length >= 8;
    const termsOk = !checkbox || checkbox.checked;

    const ok = userOk && emailOk && passOk && termsOk;

    if (!ok && button) {
        button.style.animation = ANIM_BTN_ERR;
        resetButtonAnim(button, BTN_ERR_MS);
    }

    if (!userOk) flashFieldError(usernameError, "Nome de usuário inválido");
    if (!emailOk) flashFieldError(emailError, "Email inválido");
    if (!passOk) flashFieldError(passwordError, "Senha inválida");
    if (!termsOk) {
        const msg = "Você deve concordar com os termos";
        if (termsError) flashFieldError(termsError, msg);
        else if (passOk) flashFieldError(passwordError, msg);
    }

    if (ok && button) {
        button.style.animation = ANIM_BTN_OK;
        resetButtonAnim(button, BTN_OK_MS);
    }
}

function initPasswordToggle() {
    const passwordInput = document.getElementById("auth_form_content_password_input");
    const passwordToggle = document.getElementById("auth_form_content_password_toggle");
    if (!passwordInput || !passwordToggle) return;

    passwordToggle.addEventListener("click", () => {
        const showing = passwordInput.type === "text";
        passwordInput.type = showing ? "password" : "text";
        const visible = passwordInput.type === "text";
        passwordToggle.setAttribute("aria-pressed", visible ? "true" : "false");
        passwordToggle.setAttribute(
            "aria-label",
            visible ? "Ocultar senha digitada" : "Mostrar senha digitada",
        );
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth_form_content")?.addEventListener("submit", verify_authentication);
    initPasswordToggle();
});
