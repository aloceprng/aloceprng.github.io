const cursor = document.createElement("div");
cursor.classList.add("cursor");
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});

const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove("active-tab"));
        tabContents.forEach(c => c.classList.remove("active-content"));

        tab.classList.add("active-tab");

        document.querySelector(`.content[data-content="${target}"]`).classList.add("active-content");;
    })

    tab.addEventListener("mouseenter", () => {
        const label = tab.dataset.label;
        cursor.textContent = label;
        cursor.classList.add("expanded");
    })

    tab.addEventListener("mouseleave", () => {
        cursor.textContent = "";
        cursor.classList.remove("expanded");
    })
});

const aboutMeTitle = document.querySelector(".about-me-title");

aboutMeTitle.addEventListener("mouseenter", () => {
    const label = aboutMeTitle.dataset.label;
    cursor.textContent = label;
    cursor.classList.add("expanded");
})

aboutMeTitle.addEventListener("mouseleave", () => {
    cursor.textContent = "";
    cursor.classList.remove("expanded");
})

//3d transform thingy

const body = document.getElementById("body");

body.addEventListener("mousemove", (e) => {
    const rect = body.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    body.style.setProperty("--mouse-x", x);
    body.style.setProperty("--mouse-y", y);
});

body.addEventListener("mouseleave", () => {
    body.style.setProperty("--mouse-x", 50);
    body.style.setProperty("--mouse-y", 50);
});

//show panel

function showPanel(panelName) {
    const panel = document.querySelector("." + panelName);
    const currentDisplay = getComputedStyle(panel).display;

    if (currentDisplay === "none") panel.style.display = "block";
    else panel.style.display = "none";

    dragPanel(panel)
}

function dragPanel(panel) {
    var x1 = 0, y1 = 0, x2 = 0, y2 = 0;

    const dragMouseDown = (e) => {
        e.preventDefault();
        x1 = e.clientX;
        y1 = e.clientY;
        document.addEventListener("mouseup", closeDrag);
        document.addEventListener("mousemove", drag);
    };

    const drag = (e) => {
        e.preventDefault();
        x2 = x1 - e.clientX;
        y2 = y1 - e.clientY;

        x1 = e.clientX;
        y1 = e.clientY;

        panel.style.top = `${panel.offsetTop - y2}px`;
        panel.style.left = `${panel.offsetLeft - x2}px`;
    };

    const closeDrag = (e) => {
        document.removeEventListener("mouseup", closeDrag);
        document.removeEventListener("mousemove", drag);
    };
    
    const header = document.querySelector("." + panel.classList[0] + "-header");
    if (header) {
        header.onmousedown = dragMouseDown;
    }
}

function copyEmail() {
    navigator.clipboard.writeText("alicepeng72@gmail.com")
    cursor.textContent = "email copied!";
    cursor.classList.add("expanded");

    setTimeout(() => {
        cursor.textContent = ""
        cursor.classList.remove("expanded");
        cursor.style.animation = "horizontal-load-out 0.25s linear";
    }, 2000);
}