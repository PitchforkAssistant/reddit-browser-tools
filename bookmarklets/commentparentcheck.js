javascript: (function () {
    const threadsToCheck = {};
    document.querySelectorAll("#siteTable>.thing.comment:not(.parentchecked)").forEach(e => {
        const threadID = e.dataset.permalink.split("/")[4];
        if (threadID in threadsToCheck) {
            threadsToCheck[threadID].push(e);
        } else {
            threadsToCheck[threadID] = [e];
        }
    });

    if (Object.keys(threadsToCheck).length === 0) {
        alert("No applicable comments found.\nThis script is meant to be ran on pages that show comments without their parent post, like the modqueue or user overview.");
        return;
    }

    const fetchOptions = {
        credentials: "include",
        redirect: "error",
        method: "GET",
        cache: "no-store",
    };

    const threadSetPromises = [];
    const threadSet = new Set();
    Object.keys(threadsToCheck).forEach(threadID => {
        if (threadSet.size === 100) {
            threadSetPromises.push(fetch(`/by_id/${Array.from(threadSet).join(",")}.json`, fetchOptions).then(response => response.json()));
            threadSet.clear();
        }
        threadSet.add(`t3_${threadID}`);
    });
    if (threadSet.size > 0 && threadSet.size <= 100) {
        threadSetPromises.push(fetch(`/by_id/${Array.from(threadSet).join(",")}.json`, fetchOptions).then(response => response.json()));
    }

    Promise.all(threadSetPromises).then(threadSets => {
        const threads = [];
        threadSets.forEach(threadSet => {
            if (threadSet.error) {
                console.log(threadSet.error);
                return;
            }
            threadSet.data.children.forEach(thread => {
                threads.push(thread);
            });
        });

        threads.forEach(thread => {
            const threadData = thread.data;
            const threadID = threadData.id;
            const threadRemovedBy = threadData.banned_by;
            const threadRemovedCategory = threadData.removed_by_category;

            let applyLabel = false;
            const commentLabel = document.createElement("span");
            commentLabel.classList.add("commentparentcheck");
            commentLabel.style.color = "#A00";

            if (threadRemovedBy) {
                applyLabel = true;
                commentLabel.classList.add("commentparentcheck-removed");
                commentLabel.innerHTML = `&nbsp;<b>[removed by ${threadRemovedBy}]</b>`;
            } else if (threadRemovedCategory) {
                applyLabel = true;
                if (threadRemovedCategory === "deleted") {
                    commentLabel.classList.add("commentparentcheck-deleted");
                    commentLabel.innerHTML = "&nbsp;<b>[deleted]</b>";
                } else {
                    commentLabel.classList.add("commentparentcheck-adminremoved");
                    commentLabel.innerHTML = `&nbsp;<b>[${threadRemovedCategory}]</b>`;
                }
            }

            if (applyLabel) {
                threadsToCheck[threadID].forEach(e => {
                    e.classList.add("parentchecked");
                    e.querySelector(":scope>.parent").appendChild(commentLabel.cloneNode(true));
                });
            }
        });
    });
})();
