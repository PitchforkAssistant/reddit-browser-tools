// ==UserScript==
// @name         RES Image Size Label
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds image size label when its expando is opened. Requires RES, supports NER.
// @author       /u/PitchforkAssistant
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// ==/UserScript==

function docLoaded () {
    function mutationHandler (mutationList) {
        mutationList.forEach(mutation => {
            // Only look for class changes.
            if (mutation.type !== "attributes" || mutation.attributeName !== "class") {
                return;
            }

            // Check that the element is an image expando button that isn't collapsed.
            if (!mutation.target.classList || !mutation.target.classList.contains("expando-button") || !mutation.target.classList.contains("image") || mutation.target.classList.contains("collapsed")) {
                return;
            }

            const spanParent = mutation.target.closest(".entry").querySelector(".res-expando-box .res-image"); // We'll attach the image dimensions label to this.
            // Check that the label doesn't already exist.
            if (spanParent.querySelectorAll(".imgSizeLabel").length) {
                return;
            }

            const span = document.createElement("span"); // Create the label,
            span.classList.add("imgSizeLabel"); // Give it a class so we can easily check whether it's already there.
            spanParent.prepend(span); // Add it inside the parent, right at the beginning.

            const img = spanParent.querySelector(".res-expando-box img.res-image-media"); // Find the image itself.
            if (img.complete) {
                span.innerHTML = `${img.naturalWidth}x${img.naturalHeight}`; // Image has already loaded, set the label text to its dimensions.
            } else {
                img.addEventListener("load", () => {
                    span.innerHTML = `${img.naturalWidth}x${img.naturalHeight}`; // Wait for the image to load and then set its label text to its dimensions.
                });
            }
        });
    }

    // Start observing mutations.
    const observer = new MutationObserver(mutationHandler);
    observer.observe(document.querySelector("#siteTable"), {childList: true, attributes: true, subtree: true});
}

// Don't run inside iFrames.
if (window.self === window.top) {
    // Run if the document is loaded or wait for it to load and then run.
    if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
        docLoaded();
    } else {
        document.addEventListener("DOMContentLoaded", docLoaded);
    }
}
