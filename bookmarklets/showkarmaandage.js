javascript: (function () {
    const userFullIDs = new Set();
    const authorElements = {};

    document.querySelectorAll(".author[class*= id-t2]").forEach(e => {
        if (!e.parentNode.classList.contains("karmaAgeTags-added")) {
            e.className.split(" ").every(c => {
                if (c.startsWith("id-t2_")) {
                    const userFullID = c.replace("id-", "");
                    userFullIDs.add(userFullID);
                    if (!(userFullID in authorElements)) {
                        authorElements[userFullID] = [];
                    }
                    authorElements[userFullID].push(e);
                    return false;
                }
                return true;
            });
        }
    });

    if (!document.querySelector(".karmaAgeTags-style")) {
        const style = document.createElement("style");
        style.classList.add("karmaAgeTags-style");
        style.innerHTML = ".karmaAgeTags-linkKarma{color:red} .karmaAgeTags-commentKarma{color:green} .karmaAgeTags-age{color:blue}";
        document.head.appendChild(style);
    }

    const fetchOptions = {
        credentials: "include",
        redirect: "error",
        method: "GET",
        cache: "no-store",
    };

    const userSetInfoPromises = [];
    const setOfUsers = new Set();
    userFullIDs.forEach(userFullID => {
        if (setOfUsers.size === 300) {
            userSetInfoPromises.push(fetch(`/api/user_data_by_account_ids.json?ids=${Array.from(setOfUsers).join(",")}`, fetchOptions)
                .then(response => response.json())
                .catch(error => console.log(error)));
            setOfUsers.clear();
        }
        setOfUsers.add(userFullID);
    });
    if (setOfUsers.size > 0 && setOfUsers.size <= 300) {
        userSetInfoPromises.push(fetch(`/api/user_data_by_account_ids.json?ids=${Array.from(setOfUsers).join(",")}`, fetchOptions)
            .then(response => response.json())
            .catch(error => console.log(error)));
    }

    Promise.all(userSetInfoPromises).then(userSetInfos => {
        userSetInfos.forEach(userSetInfo => {
            if (userSetInfo.error) {
                if (userSetInfo.error === 404 || userSetInfo.error === 403) {
                    return;
                } else {
                    console.log(userSetInfo.error);
                    return;
                }
            }

            Object.keys(userSetInfo).forEach(userFullID => {
                const userInfo = userSetInfo[userFullID];
                const linkKarma = userInfo.link_karma;
                const commentKarma = userInfo.comment_karma;
                const createdUTC = userInfo.created_utc;
                const ageDays = parseInt((new Date().getTime() - new Date(createdUTC * 1000).getTime()) / (1000 * 60 * 60 * 24));

                const karmaAgeTag = document.createElement("span");
                karmaAgeTag.classList.add("karmaAgeTags");
                karmaAgeTag.dataset.totalkarma = linkKarma + commentKarma;
                karmaAgeTag.innerHTML = `(<span class="karmaAgeTags-linkKarma" data-linkkarma=${linkKarma}><b>l: </b>${linkKarma}</span> /` +
                                        ` <span class="karmaAgeTags-commentKarma" data-commentkarma=${commentKarma}><b>c: </b>${commentKarma}</span> /` +
                                        ` <span class="karmaAgeTags-age" data-agedays=${ageDays} data-createdutc=${createdUTC} title="${new Date(createdUTC * 1000).toUTCString().replace("GMT", "UTC")}"><b>d: </b>${ageDays} days</span>) `;

                authorElements[userFullID].forEach(authorElement => {
                    authorElement.parentNode.classList.add("karmaAgeTags-added");
                    authorElement.after(karmaAgeTag.cloneNode(true));
                });
            });
        });
    });
})();
