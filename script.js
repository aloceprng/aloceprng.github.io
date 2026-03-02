const cursor = document.createElement("div");
cursor.classList.add("cursor");
document.body.appendChild(cursor);

let mouseX = window.innerWidth / 2;
let mouseY = (window.innerHeight / 2);
let cursorX = mouseX;
let cursorY = mouseY;

let tiltX = 50, tiltY = 50;
let targetTiltX = 50, targetTiltY = 50;

const LERP = 0.12;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const rect = document.getElementById("body").getBoundingClientRect();
    targetTiltX = ((e.clientX - rect.left) / rect.width) * 100;
    targetTiltY = ((e.clientY - rect.top) / rect.height) * 100;
}, { passive: true });

document.getElementById("body").addEventListener("mouseleave", () => {
    targetTiltX = 50;
    targetTiltY = 50;
}, { passive: true });

function animationLoop() {
    cursorX += (mouseX - cursorX) * LERP;
    cursorY += (mouseY - cursorY) * LERP;
    cursor.style.left = `${cursorX - 10}px`;
    cursor.style.top = `${cursorY - 10}px`;

    tiltX += (targetTiltX - tiltX) * LERP;
    tiltY += (targetTiltY - tiltY) * LERP;
    document.getElementById("body").style.setProperty("--mouse-x", tiltX.toFixed(2));
    document.getElementById("body").style.setProperty("--mouse-y", tiltY.toFixed(2));

    requestAnimationFrame(animationLoop);
}

requestAnimationFrame(animationLoop);

function setCursorLabel(label) {
    cursor.textContent = label ?? "";
    cursor.classList.toggle("expanded", !!label);
}

const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active-tab"));
        tabContents.forEach(c => c.classList.remove("active-content"));
        tab.classList.add("active-tab");
        document.querySelector(`.content[data-content="${tab.dataset.tab}"]`).classList.add("active-content");
    });

    tab.addEventListener("mouseenter", () => setCursorLabel(tab.dataset.label));
    tab.addEventListener("mouseleave", () => setCursorLabel(null));
});

const aboutMeTitle = document.querySelector(".about-me-title");
aboutMeTitle.addEventListener("mouseenter", () => setCursorLabel(aboutMeTitle.dataset.label));
aboutMeTitle.addEventListener("mouseleave", () => setCursorLabel(null));

const dragState = new WeakMap();

function showPanel(panelName) {
    const panel = document.querySelector("." + panelName);
    const isHidden = getComputedStyle(panel).display === "none";

    panel.style.display = isHidden ? "block" : "none";

    if (isHidden) initDrag(panel);
}

function initDrag(panel) {
    if (dragState.has(panel)) return;
    dragState.set(panel, true);

    const header = document.querySelector("." + panel.classList[0] + "-header");
    if (!header) return;

    let x1 = 0, y1 = 0;

    const onMove = (e) => {
        e.preventDefault();

        const dx = x1 - e.clientX;
        const dy = y1 - e.clientY;

        x1 = e.clientX;
        y1 = e.clientY;

        panel.style.top = `${panel.offsetTop - dy}px`;
        panel.style.left = `${panel.offsetLeft - dx}px`;
    };

    const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
    };

    header.addEventListener("mousedown", (e) => {
        e.preventDefault();

        x1 = e.clientX;
        y1 = e.clientY;

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    });
}

let copyTimer = null;

function copyEmail() {
    navigator.clipboard.writeText("alicepeng72@gmail.com");
    setCursorLabel("email copied!");

    clearTimeout(copyTimer);

    copyTimer = setTimeout(() => {
        setCursorLabel(null);
        cursor.style.animation = "horizontal-load-out 0.25s linear";
    }, 2000);
}