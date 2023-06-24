// ==UserScript==
// @name         Show Registration Time
// @description  Shows registration times on legacy profiles next to the "registered x ago" text, that way there is no need to waste time hovering over it.
// @author       /u/PitchforkAssistant
// @version      2.0.0
// @match        https://www.reddit.com/user/*
// @match        https://old.reddit.com/user/*
// @grant        none
// ==/UserScript==

function showRegTime () {
    const creationTimeElement = document.querySelector(".side .age time");
    if (!creationTimeElement) {
        return;
    }

    const element = document.createElement("span");
    element.textContent = creationTimeElement.title;
    creationTimeElement.parentNode.after(element);
}

if (document.readyState !== "loading") {
    showRegTime();
} else {
    document.addEventListener("DOMContentLoaded", showRegTime);
}
