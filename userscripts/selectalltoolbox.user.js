// ==UserScript==
// @name         Add Select All Button to Toolbox Quick Actions
// @description  Adds a select all button to the quick actions pop up that Toolbox shows when you click on the M button next to a user's name.
// @version      1.0.0
// @author       /u/PitchforkAssistant
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        none
// ==/UserScript==

function addSelectAllButton () {
    const parentElement = document.querySelector(".tb-window.mod-popup:not(.selectAllAdded) .tb-window-tab.user-role .tb-window-content");

    parentElement.parentElement.parentElement.classList.add("selectAllAdded");

    const selectAllButton = document.createElement("a");
    selectAllButton.innerHTML = "select all";
    selectAllButton.className = "tb-general-button";
    selectAllButton.href = "javascript:;";

    parentElement.prepend(selectAllButton);

    selectAllButton.addEventListener("click", () => {
        const checkboxes = parentElement.querySelectorAll("input[type=checkbox]");
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
    });
}

const observer = new MutationObserver(() => {
    if (document.querySelector(".tb-window.mod-popup:not(.selectAllAdded)")) {
        addSelectAllButton();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
