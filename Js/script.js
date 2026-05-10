const button = document.getElementById("themeBtn");
const menu = document.getElementById("themeMenu");
const items = menu.querySelectorAll("[role='menuitem']");

function openMenu() {
    menu.hidden = false;
    button.setAttribute("aria-expanded", "true");
}

function closeMenu() {
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
}

button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    expanded ? closeMenu() : openMenu();
});

items.forEach(item => {
    item.addEventListener("click", () => {
        const theme = item.dataset.theme;

        document.documentElement.dataset.theme = theme;
        localStorage.setItem("theme", theme);

        if(theme === "light") {
            document.body.style.backgroundImage = "url('/covers/bg-light.png')";
        }
        else {            document.body.style.backgroundImage = "url('/covers/background.png')";
        }
        closeMenu();
    });

    item.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            item.click();
        }
    });
});

document.addEventListener("click", e => {
    if (
        !button.contains(e.target) &&
        !menu.contains(e.target)
    ) {
        closeMenu();
    }
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        closeMenu();
        button.focus();
    }
});

const saved =
    localStorage.getItem("theme") || "light";

document.documentElement.dataset.theme = saved;

if(saved === "light") {
    document.body.style.backgroundImage = "url('/covers/bg-light.png')";
} else {
    document.body.style.backgroundImage = "url('/covers/background.png')";
}