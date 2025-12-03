
document.addEventListener("DOMContentLoaded", () => {
    const sound = document.getElementById("scroll-sound");
    let played = false;

    window.addEventListener("scroll", () => {
        const triggerPoint = 32980;
        if (!played && window.scrollY > triggerPoint) {
            sound.volume = 0.4;
            sound.play();
            played = true;
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    let lockPoint = 7300;
    let locked = false;

    window.addEventListener("scroll", () => {
        if (!locked && window.scrollY > lockPoint) {
            locked = true;
        }

        if (locked && window.scrollY < lockPoint) {
            window.scrollTo(0, lockPoint);
        }
    });
});


function startControlFight(el) {
    function flickerEpisode() {
        const bursts = Math.floor(Math.random() * 3) + 1;
        let count = 0;

        function doOne() {
            el.classList.add("glitching");
            const glitchTime = 200 + Math.random() * 300;

            setTimeout(() => {
                el.classList.remove("glitching");
                count++;

                if (count < bursts) {
                    setTimeout(doOne, 60 + Math.random() * 120);
                } else {
                    const next = 1200 + Math.random() * 6000;
                    setTimeout(flickerEpisode, next);
                }
            }, glitchTime);
        }

        doOne();
    }

    setTimeout(flickerEpisode, 500 + Math.random() * 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".fight-text").forEach(startControlFight);
});


document.addEventListener("DOMContentLoaded", () => {
    let warpRunning = false;
    let warpFinished = false;

    const startPoint = 9500;
    const endPoint = 12500;
    let warpTimeout = null;

    function runWarpBurst() {
        if (warpFinished) return;

        const warp = document.getElementById("crt-warp");
        const duration = Math.floor(Math.random() * 700 + 200);

        warp.classList.add("warping");
        warp.style.animation = `crtWarpEffect ${duration}ms steps(2, end)`;

        setTimeout(() => {
            warp.classList.remove("warping");
            warp.style.animation = "none";

            if (!warpFinished) {
                warpTimeout = setTimeout(runWarpBurst, Math.random() * 4200 + 300);
            }
        }, duration + 50);
    }

    window.addEventListener("scroll", () => {
        if (!warpRunning && window.scrollY > startPoint) {
            warpRunning = true;
            runWarpBurst();
        }

        if (!warpFinished && window.scrollY > endPoint) {
            warpFinished = true;
            clearTimeout(warpTimeout);
            const warp = document.getElementById("crt-warp");
            warp.style.animation = "none";
            warp.classList.remove("warping");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const fadeLayer = document.getElementById("deadend-fade");

    const startFade = 20500;  // where fading begins
    const endFade   = 40000; // where it reaches full opacity

    window.addEventListener("scroll", () => {

        const y = window.scrollY;

        if (y <= startFade) {
            fadeLayer.style.opacity = "0";
        } else if (y >= endFade) {
            fadeLayer.style.opacity = "1";
        } else {
            // Calculate progress between 0 and 1
            const progress = (y - startFade) / (endFade - startFade);
            fadeLayer.style.opacity = String(progress);
        }
    });

});


document.addEventListener("DOMContentLoaded", () => {
    const sound = document.getElementById("scroll-sound-door");
    let played = false;

    window.addEventListener("scroll", () => {
        const triggerPoint = 16800;
        if (!played && window.scrollY > triggerPoint) {
            sound.volume = 0.5;
            sound.play();
            played = true;
        }
    });
});

const VOID_THRESHOLD = 33001;   // px scrolled before void triggers
let VOID_TRIGGERED = false;

function activateVoidBackground() {
    const voidBG = document.getElementById("void-bg");

    // Make sure it's hidden until now
    voidBG.style.display = "block";       // ← becomes renderable
    voidBG.style.opacity = "0";           // ← still invisible

    requestAnimationFrame(() => {
        voidBG.style.transition = "opacity 4s linear";
        voidBG.style.opacity = "1";       // ← fade-in begins
    });
}


function eraseAboveThreshold() {
    const elements = document.querySelectorAll("#content-wrapper > *");

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();

        // If the element's bottom edge is above the threshold,
        // it has been "passed" by the user → delete it
        if (rect.bottom < VOID_THRESHOLD) {
            el.remove();
        }
    });
}


window.addEventListener("scroll", () => {

    if (!VOID_TRIGGERED && window.scrollY > VOID_THRESHOLD) {

        VOID_TRIGGERED = true;
   
        activateVoidBackground();
        eraseAboveThreshold();
        window.scrollTo({
            top: VOID_THRESHOLD + 80,
            behavior: "smooth"
        });
    }
});



const WHISPER_LINES = [
    "ｄｏ　ｎｏｔ　ｔｕｒｎ　ｂａｃｋ",
    "ｉｔ　ｈｅａｒｓ　ｙｏｕｒ　ｂｒｅａｔｈ",
    "ｙｏｕ　ａｒｅ　ｎｏｔ　ａｌｏｎｅ",
    "ｔｈｅ　ｄａｒｋ　ｉｓ　ｐａｔｉｅｎｔ",
    "ｓｏｍｅｔｈｉｎｇ　ｆｏｌｌｏｗｓ",
    "ｋｅｅｐ　ｍｏｖｉｎｇ",
    "ｗｈｙ　ｄｉｄ　ｙｏｕ　ｃｏｍｅ　ｈｅｒｅ",
    "ｉｔ　ｒｅｍｅｍｂｅｒｓ　ｙｏｕ",
    "ｙｏｕｒ　ｆｏｏｔｓｔｅｐｓ　ｅｃｈｏ",
    "ｓｉｌｅｎｃｅ　ｌｉｓｔｅｎｓ",
    "ｙｏｕ　ｗａｌｋ　ｉｎ　ｉｔｓ　ｍｏｕｔｈ",
    "ｔｈｅ　ｗａｌｌｓ　ｂｒｅａｔｈｅ",
    "ｉｔ　ｇｒｏｗｓ　ｈｕｎｇｒｙ",
    "ｓｈａｄｏｗｓ　ｐｅｅｌ　ｉｎｗａｒｄ",
    "ｙｏｕｒ　ｍｉｎｄ　ｆｒａｙｓ　ｓｏｆｔｌｙ",
    "ｔｈｅ　ｄａｒｋ　ｒｅｐｅａｔｓ　ｙｏｕｒ　ｔｈｏｕｇｈｔｓ",
    "ｉｔ　ｋｎｏｗｓ　ｙｏｕｒ　ｓｈａｐｅ",
    "ｙｏｕ　ｓｔｉｒ　ｉｔｓ　ｓｌｅｅｐ",
    "ｔｈｅ　ｇｒｏｕｎｄ　ｗａｋｅｓ",
    "ｙｏｕ　ａｒｅ　ｉｎｓｉｄｅ　ｓｏｍｅｔｈｉｎｇ",
    "ｉｔ　ｗａｔｃｈｅｓ　ｗｉｔｈｏｕｔ　ｂｌｉｎｋｉｎｇ",
    "ｙｏｕｒ　ｎａｍｅ　ｉｓ　ｆａｄｉｎｇ",
    "ｔｈｅ　ｓｉｌｅｎｃｅ　ｂｅｎｄｓ",
    "ｔｈｅ　ｖｏｉｄ　ｌｅａｎｓ　ｃｌｏｓｅｒ",
    "ｄｏ　ｎｏｔ　ｓｌｏｗ　ｄｏｗｎ",
    "ｓｏｍｅｔｈｉｎｇ　ｂｒｅａｔｈｅｓ　ｂｅｈｉｎｄ",
    "ｔｈｅ　ｌｉｇｈｔ　ｌｉｅｓ",
    "ｙｏｕ　ｗｅｒｅ　ｅｘｐｅｃｔｅｄ",
    "ｙｏｕ　ａｒｅ　ｂｅｉｎｇ　ｍｅａｓｕｒｅｄ",
    "ｙｏｕ　ｗａｌｋ　ｏｖｅｒ　ｂｕｒｉｅｄ　ｍｏｕｔｈｓ",
    "ｔｈｅ　ｄａｒｋ　ｅｎｊｏｙｓ　ｙｏｕ",
    "ｙｏｕｒ　ｓｈａｄｏｗ　ｔｒｅｍｂｌｅｓ",
    "ｔｈｅ　ｖｏｉｄ　ｗｈｉｓｐｅｒｓ　ｂａｃｋ"
];

const whisperContainer = document.getElementById("whisper-container");
let whisperScrollStrength = 0;


/* Increase opacity as user scrolls */
function updateWhisperStrength() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = window.scrollY / maxScroll;

    whisperScrollStrength = Math.min(progress * 1.6, 0.45);
}
window.addEventListener("scroll", updateWhisperStrength);


/* Spawn a whisper on screen */
function spawnWhisper() {
    const w = document.createElement("div");
    w.className = "whisper";

    w.textContent = WHISPER_LINES[Math.floor(Math.random() * WHISPER_LINES.length)];

    // Random placement
    w.style.left = (Math.random() * 80 + 10) + "vw";
    w.style.top  = (Math.random() * 80 + 10) + "vh";

    whisperContainer.appendChild(w);

    // Fade-in with scroll strength
    requestAnimationFrame(() => {
        w.style.opacity = whisperScrollStrength;
    });

    // Fade out and remove
    setTimeout(() => {
        w.style.opacity = 0;
        setTimeout(() => w.remove(), 2000);
    }, 4000);
}


/* Spawn rate tied to scroll depth */
function whisperLoop() {

    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = window.scrollY / maxScroll;


    const spawnMultiplier = 1 + progress * 6;

    for (let i = 0; i < spawnMultiplier; i++) {
        spawnWhisper();
    }

    // Random delay between bursts
    const nextDelay = Math.random() * 2000 + 1000;
    setTimeout(whisperLoop, nextDelay);
}

whisperLoop();


let lastScrollY = 0;
let lastPullTime = 0;

function voidPullCheck() {
    const now = Date.now();
    const delta = window.scrollY - lastScrollY;

    // Only trigger when scrolling DOWN quickly enough
    const scrollingDownFast = delta > 25;

    // Limit frequency (no more than once every ~4–7 seconds)
    const timeSincePull = now - lastPullTime;
    const cooldown = Math.random() * 1000 + 4000;  // 3–6 sec cooldown

    if (scrollingDownFast && timeSincePull > cooldown) {

        // Trigger the pull
        document.body.classList.add("void-pull");

        // Release after a moment
        setTimeout(() => {
            document.body.classList.remove("void-pull");
            document.body.classList.add("void-release");

            // Remove release state after animation
            setTimeout(() => {
                document.body.classList.remove("void-release");
            }, 250);

        }, 120);

        lastPullTime = now;
    }

    lastScrollY = window.scrollY;
}

window.addEventListener("scroll", voidPullCheck);

