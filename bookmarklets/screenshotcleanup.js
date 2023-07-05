javascript: (function () {
    const removalTargets = [".commentarea>.infobar",
        ".tb-frontend-container",
        ".username-highlighter-userscript",
        ".username-highlighter-userscript",
        "a.voteWeight",
        ".imageInfo",
        ".masstagger",
        ".imageInfoExpando",
        ".RESUserTag",
        "ul.flat-list.buttons",
        ".usertext.cloneable.warn-on-unload",
        ".commentarea>.menuarea",
        ".commentarea>.panestack-title",
        ".comment-parent-checker",
        ".approval-checkmark",
        ".karmaAgeTags",
        ".zombieTag",
        ".subreddit-subscribe",
        ".imgSizeLabel",
        ".reddit-infobar",
        ".comment-visits-box",
        "#tb-context-menu",
        "#tb-bottombar"];
    removalTargets.forEach(e => {
        document.querySelectorAll(e).forEach(e => e.remove());
    });

    document.querySelectorAll(".comment .tagline:not(.screenshot-cleanup)").forEach(e => {
        e.classList.add("screenshot-cleanup");
        const removeButton = document.createElement("span");
        removeButton.textContent = "[X]";
        removeButton.style.cursor = "pointer";
        removeButton.style.float = "left";
        removeButton.addEventListener("click", function () {
            let comment = this.closest(".comment, .morechildren");
            if (comment.parentElement.parentElement.classList.contains("child") && comment.parentElement.querySelectorAll(":scope>.thing").length === 1) {
                comment = comment.parentElement.parentElement;
            }
            comment.style.transition = "opacity 0.5s";
            comment.style.opacity = 0;
            setTimeout(() => comment.remove(), 500);
        });
        e.appendChild(removeButton);
    });
})();
