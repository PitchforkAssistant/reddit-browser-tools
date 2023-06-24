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
        ".imgSizeLabel"];
    removalTargets.forEach(e => {
        document.querySelectorAll(e).forEach(e => e.remove());
    });

    document.querySelectorAll(".comment .tagline:not(.screenshot-cleanup)").forEach(e => {
        const removeButton = document.createElement("span");
        removeButton.textContent = "[X]";
        removeButton.style.cursor = "pointer";
        removeButton.style.float = "left";
        removeButton.classList.add("screenshot-cleanup");
        removeButton.addEventListener("click", function () {
            const comment = this.closest(".comment, .morechildren");
            comment.style.transition = "opacity 0.5s";
            comment.style.opacity = 0;
            setTimeout(() => comment.remove(), 500);
        });
        e.appendChild(removeButton);
    });
})();
