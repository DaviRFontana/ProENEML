const AUTH_THEME_KEY = "auth_theme";
const THEME_TOGGLE_IDS = [
    "toggle_theme_button_input_light",
    "toggle_theme_button_input_dark",
    "toggle_theme_button_input_system",
];

(function applySavedTheme() {
    const saved = localStorage.getItem(AUTH_THEME_KEY);
    if (saved === "light" || saved === "dark") {
        document.documentElement.setAttribute("data-theme", saved);
    }
})();

function sync_theme_toggle_brightness_from_storage() {
    const saved = localStorage.getItem(AUTH_THEME_KEY);
    const active =
        saved === "light"
            ? THEME_TOGGLE_IDS[0]
            : saved === "dark"
              ? THEME_TOGGLE_IDS[1]
              : THEME_TOGGLE_IDS[2];

    for (const id of THEME_TOGGLE_IDS) {
        document.getElementById(id)?.removeAttribute("aria-current");
    }
    document.getElementById(active)?.setAttribute("aria-current", "true");
}

function toggle_theme(theme) {
    const root = document.documentElement;
    if (theme === "system") {
        root.removeAttribute("data-theme");
        localStorage.removeItem(AUTH_THEME_KEY);
    } else {
        root.setAttribute("data-theme", theme);
        localStorage.setItem(AUTH_THEME_KEY, theme);
    }
    sync_theme_toggle_brightness_from_storage();
}

document.addEventListener("DOMContentLoaded", () => {
    sync_theme_toggle_brightness_from_storage();

    const byId = (id) => document.getElementById(id);
    byId(THEME_TOGGLE_IDS[0])?.addEventListener("click", () => toggle_theme("light"));
    byId(THEME_TOGGLE_IDS[1])?.addEventListener("click", () => toggle_theme("dark"));
    byId(THEME_TOGGLE_IDS[2])?.addEventListener("click", () => toggle_theme("system"));
});
