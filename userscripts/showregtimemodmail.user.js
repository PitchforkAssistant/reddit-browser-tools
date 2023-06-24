// ==UserScript==
// @name         Show Registration Time in New Modmail
// @description  Shows registration time on the info bar under "redditor for x"
// @version      2.0.0
// @author       /u/PitchforkAssistant
// @match        https://mod.reddit.com/mail/*
// @grant        none
// ==/UserScript==

function loadAccountRegistrationTime () {
    const parentElement = document.querySelector(".ModIdCard__snooDetails .ModIdCard__UserProfileLink:not(.regdateadded)");
    parentElement.classList.add("regdateadded");
    const userAboutLink = `${parentElement.querySelector("a").href}/about.json`;
    fetch(userAboutLink)
        .then(response => response.json())
        .then(userAbout => {
            if (userAbout.error) {
                if (userAbout.error === 404 || userAbout.error === 403) {
                    return;
                } else {
                    console.log(userAbout.error);
                    return;
                }
            }

            const regDate = new Date(userAbout.data.created_utc * 1000).toUTCString().replace("GMT", "UTC");
            const regDateElement = document.createElement("div");
            regDateElement.innerHTML = regDate;
            regDateElement.className = "InfoBar__regdate";
            regDateElement.style.fontSize = "inherit";
            regDateElement.style.lineHeight = 1.5;
            regDateElement.style.color = "var(--color-tone-2)";
            parentElement.style.textAlign = "left";
            parentElement.insertBefore(regDateElement, parentElement.firstChild);
        });
}

const observer = new MutationObserver(() => {
    if (document.querySelector(".ModIdCard__snooDetails .ModIdCard__UserProfileLink:not(.regdateadded) a")) {
        loadAccountRegistrationTime();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
