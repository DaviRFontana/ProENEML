const ANIM_FIELD = "fade_in_out_validation_auth 1.5s ease-in-out both alternate";
const ANIM_BTN_ERR = "fade_in_out_validation_error_auth 1.5s ease-in-out both alternate";
const ANIM_BTN_OK = "fade_in_out_validation_success_auth 0.5s ease-in-out both alternate";
const ANIM_RESET = "none";
const FIELD_ERR_MS = 1500;
const BTN_ERR_MS = 1500;
const BTN_OK_MS = 500;

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_OK = /^[A-Za-z0-9_]{3,32}$/;

const FIELD_ERROR_CLASS = "auth_field_has_error";

function clearError(el) {
    if (!el) return;
    el.textContent = "";
    el.style.animation = ANIM_RESET;
}

function getFieldContainer(inputEl) {
    if (!inputEl) return null;
    return (
        inputEl.closest(".auth_form_content_input_container") ||
        inputEl.closest("#auth_form_content_terms_container")
    );
}

function clearFieldError(inputEl, errorEl) {
    clearError(errorEl);
    const container = getFieldContainer(inputEl);
    container?.classList.remove(FIELD_ERROR_CLASS);
}

function setFieldError(inputEl, errorEl, message) {
    if (!errorEl) return;

    errorEl.textContent = message;
    errorEl.style.animation = ANIM_FIELD;

    const container = getFieldContainer(inputEl);
    container?.classList.add(FIELD_ERROR_CLASS);

    if (!inputEl) return;

    const eventName = inputEl.type === "checkbox" ? "change" : "input";
    const onEdit = () => clearFieldError(inputEl, errorEl);
    inputEl.addEventListener(eventName, onEdit, { once: true });
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

    clearFieldError(usernameInput, usernameError);
    clearFieldError(emailInput, emailError);
    clearFieldError(passwordInput, passwordError);
    clearFieldError(checkbox, termsError);

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

    if (!userOk) setFieldError(usernameInput, usernameError, "Apelido inválido");
    if (!emailOk) setFieldError(emailInput, emailError, "Email inválido");
    if (!passOk) setFieldError(passwordInput, passwordError, "Senha inválida");
    if (!termsOk) {
        const msg = "Você deve concordar com os termos";
        if (termsError) setFieldError(checkbox, termsError, msg);
        else if (passOk) setFieldError(passwordInput, passwordError, msg);
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

    const passwordWrap = passwordInput.closest(".auth_form_content_password_wrap");
    if (passwordWrap) {
        passwordWrap.classList.toggle("password-visible", passwordInput.type === "text");
    }

    passwordToggle.addEventListener("click", () => {
        const showing = passwordInput.type === "text";
        passwordInput.type = showing ? "password" : "text";
        const visible = passwordInput.type === "text";
        passwordToggle.setAttribute("aria-pressed", visible ? "true" : "false");
        passwordToggle.setAttribute(
            "aria-label",
            visible ? "Ocultar senha digitada" : "Mostrar senha digitada",
        );
        passwordWrap?.classList.toggle("password-visible", visible);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth_form_content")?.addEventListener("submit", verify_authentication);
    initPasswordToggle();
});
