function toggle_auth_method() {
    const button = document.getElementById("auth_form_content_submit_button")
    const text = document.getElementById("auth_form_content_footer_text")
    const link = document.getElementById("auth_form_content_footer_text_link")
    if (text.textContent === "Não tem uma conta?") {
        text.textContent = "Já tem uma conta?";
        link.textContent = "Entrar";
        button.textContent = "Criar conta";
    }
    else {
        text.textContent = "Não tem uma conta?";
        link.textContent = "Crie uma agora";
        button.textContent = "Entrar";
    }
}

function verify_authentication() {
    const button = document.getElementById("auth_form_content_submit_button");
    const checkbox = document.getElementById("auth_form_content_terms_checkbox");
    const email = document.getElementById("auth_form_content_email_input").value;
    const password = document.getElementById("auth_form_content_password_input").value;
    if (email.includes("@") && password.length >= 8 && checkbox.checked) {
        document.getElementById("auth_form_content_email_title_error").textContent = "";
        document.getElementById("auth_form_content_password_title_error").textContent = "";
        button.classList.add("auth_form_content_footer_button_success");
        setTimeout(() => {
            button.classList.remove("auth_form_content_footer_button_success");
        }, 200);
        return true;
    }
    else {
        document.getElementById("auth_form_content_email_title_error").textContent = "Email inválido";
        document.getElementById("auth_form_content_email_title_error").style.animation = "fade_in_out_validation_auth 2s ease-in-out";
        document.getElementById("auth_form_content_password_title_error").textContent = "Senha inválida";
        document.getElementById("auth_form_content_password_title_error").style.animation = "fade_in_out_validation_auth 2s ease-in-out";
        setTimeout(() => {
            document.getElementById("auth_form_content_email_title_error").textContent = "";
            document.getElementById("auth_form_content_email_title_error").style.animation = "";
            document.getElementById("auth_form_content_password_title_error").textContent = "";
            document.getElementById("auth_form_content_password_title_error").style.animation = "";
        }, 2000);
    }
    return false;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth_form_content_footer_text_link")?.addEventListener("click", () => toggle_auth_method());

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