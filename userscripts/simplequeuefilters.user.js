// ==UserScript==
// @name         Simple Queue Filters
// @description  Buttons to hide all but certain types of stuff in your modqueue, requires Toolbox.
// @author       /u/PitchforkAssistant
// @version      2.0
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// ==/UserScript==

const reportBoxFromThing = thing => thing.querySelector(":scope>.entry .report-reasons");

function hasUserReports (thing) {
    const reportBox = reportBoxFromThing(thing);
    if (!reportBox) {
        return false;
    }
    const userReportItems = reportBox.querySelector(".report-reason-item:not(.mod-report):not(.report-reason-title)");
    return !!userReportItems;
}

// onlyAutoMod is more of a switch.
// If onlyAutoMod is true, then it will only return true if there's an AutoMod report.
// If onlyAutoMod is false, then it will only return true if there's a non-AutoMod mod report.
function hasModReports (thing, onlyAutoMod) {
    const reportBox = reportBoxFromThing(thing);
    if (!reportBox) {
        return false;
    }
    const modReportItems = reportBox.querySelectorAll(".report-reason-item.mod-report");
    if (!modReportItems) {
        return false;
    }
    let hasReportFromHuman = false;
    let hasReportFromAutomod = false;
    for (const reportItem of modReportItems) {
        const reportReasonText = reportItem.querySelector(".report-reason-text");
        if (reportReasonText) {
            if (reportReasonText.textContent.startsWith("AutoModerator: ")) {
                hasReportFromAutomod = true;
            } else {
                hasReportFromHuman = true;
            }
        }
    }
    return onlyAutoMod ? hasReportFromAutomod : hasReportFromHuman;
}

function hasAutoModReports (thing) {
    return hasModReports(thing, true);
}

function hasHumanModReports (thing) {
    return hasModReports(thing, false);
}

function isFiltered (thing) {
    return thing.classList.contains("spam");
}

function isApproved (thing) {
    return !!thing.querySelector(":scope>.entry .approval-checkmark");
}
function applyFilter (filterFunc) {
    document.querySelectorAll(".thing").forEach(thing => {
        if (filterFunc(thing)) {
            thing.style.removeProperty("display");
        } else {
            thing.style.display = "none";
            thing.querySelectorAll("input[type=checkbox]").forEach(checkbox => {
                checkbox.checked = false;
            });
        }
    });
}

function createFilterButton (text, filter, parent) {
    const buttonElement = document.createElement("a");
    buttonElement.textContent = text;
    buttonElement.classList.add("tb-general-button", "inoffensive", "sqf-button");
    buttonElement.addEventListener("click", () => {
        applyFilter(filter);
    });
    parent.appendChild(buttonElement);
}

function initQueueFilterButtons () {
    if (document.querySelector("#sqf-container")) {
        return;
    }

    const tbModbar = document.querySelector(".menuarea.modtools #select-all").parentNode;
    tbModbar.style.display = "flow-root";

    const container = document.createElement("div");
    container.id = "sqf-container";
    container.style.float = "right";
    container.style.whiteSpace = "nowrap";

    const containerLabel = document.createElement("label");
    containerLabel.textContent = "show: ";
    container.appendChild(containerLabel);

    tbModbar.appendChild(container);

    createFilterButton("User Reports", hasUserReports, container);
    createFilterButton("Mod Reports", hasHumanModReports, container);
    createFilterButton("AM Reports", hasAutoModReports, container);
    createFilterButton("Filtered", isFiltered, container);
    createFilterButton("Approved", isApproved, container);
}

const observer = new MutationObserver(() => {
    if (document.querySelector("body.tb-modbar-shown .menuarea.modtools #select-all")) {
        initQueueFilterButtons();
        observer.disconnect();
    } else if (document.querySelector("body.tb-modbar-shown") && !document.querySelector(".tb-queuetools-tab")) {
        // Turn off for pages without option to show queue tools.
        console.log("no queue tools");
        observer.disconnect();
    } else if (document.querySelector("[id='2x-container']")) {
        // Turn off for new Reddit.
        observer.disconnect();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
