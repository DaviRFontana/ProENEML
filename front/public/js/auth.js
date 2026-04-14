(function applySavedTheme() {
    const saved = localStorage.getItem("auth_theme");
    if (saved === "light" || saved === "dark") {
        document.documentElement.setAttribute("data-theme", saved);
    }
})();

function toggle_theme(theme) {
    const root = document.documentElement;
    if (theme === "system") {
        root.removeAttribute("data-theme");
        localStorage.removeItem("auth_theme");
    } else {
        root.setAttribute("data-theme", theme);
        localStorage.setItem("auth_theme", theme);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("toggle_theme_button_input_light")?.addEventListener("click", () => toggle_theme("light"));
    document.getElementById("toggle_theme_button_input_dark")?.addEventListener("click", () => toggle_theme("dark"));
    document.getElementById("toggle_theme_button_input_system")?.addEventListener("click", () => toggle_theme("system"));

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

