import { generate, checkNeighbors, draw, changeSize, updateDesc, randomize, updateTheme } from "./game-of-life.js";

const toggler     = document.getElementById("toggler");
const speed       = document.getElementById("speed");
const clearer     = document.getElementById("clear");
const randomizer  = document.getElementById("randomizer");
const themeColor  = document.getElementById("theme--select");
const speedVisual = document.getElementById("speed--visual");
let dimension     = document.getElementById("dimension");

let running;
let isActivated = false;

function run() {
    if(isActivated) {
        checkNeighbors();
        draw(true);
        updateDesc();
    }
}

function starter() {
    if(isActivated) {
        running = setInterval(run, 800 / speed.value);
    } else {
        draw();
        clearInterval(running);
    }
}

function toggle() { 
    isActivated = !isActivated ;
    if(isActivated) {
        toggler.classList.add("start");
        toggler.textContent = "Stop/Pause";
    } else {
        toggler.classList.remove("start");
        toggler.textContent = "Start/Generate";
    }
    starter();
}

function clear() {
    generate(themeColor.value);
    draw();
    updateDesc();
}

function setSize() {
    if(isActivated) {
        alert("Can't resize when activated, pause the game first.");
        dimension.value = dimension.oldValue;
        return;
    }
    changeSize(dimension.value)
    dimension.oldValue = dimension.value;
}

function setSpeed() {
    clearInterval(running);
    running = setInterval(run, 800 / speed.value);
    speedVisual.textContent = speed.value / 10 + "x";
}

function setRandom() {
    generate(themeColor.value);
    randomize();
    draw();
    updateDesc();
}

function setTheme() {
    let root = document.querySelector(":root");
    root.style.setProperty('--theme', themeColor.value);
    updateTheme(themeColor.value);
    draw();
}

// On Screen load
document.addEventListener('DOMContentLoaded', () => { 
    generate(themeColor.value);
    draw();
    updateDesc();
})

toggler.addEventListener('click', toggle);
clearer.addEventListener('click', clear);
randomizer.addEventListener('click', setRandom);
dimension.addEventListener('change', setSize);
speed.addEventListener('change', setSpeed);
themeColor.addEventListener('change', setTheme);