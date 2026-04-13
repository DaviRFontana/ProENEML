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

    document.querySelector(".auth_style_section_carousel_arrow:first-of-type")?.addEventListener("click", () => toggle_carousel_item("previous"));
    document.querySelector(".auth_style_section_carousel_arrow:last-of-type")?.addEventListener("click", () => toggle_carousel_item("next"));
});

