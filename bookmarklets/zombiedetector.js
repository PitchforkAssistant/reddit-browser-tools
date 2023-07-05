javascript: (function () {
    const zombieAgeThreshold = 30;
    const zombieKarmaThreshold = 10000;

    if (!document.querySelector(".zombieDetectorStyle")) {
        const style = document.createElement("style");
        style.classList.add("zombieDetectorStyle");
        style.innerHTML = ".zombieTag{border:1px yellow dashed;background-color:red;font-weight:bolder;}";
        document.head.appendChild(style);
    }

    const authors = {};
    document.querySelectorAll(".tagline>.author[class*= id-t2]:not(.zombieChecked)").forEach(e => {
        e.className.split(" ").every(c => {
            if (c.startsWith("id-t2_")) {
                const userFullID = c.replace("id-", "");
                if (!(userFullID in authors)) {
                    authors[userFullID] = [];
                }
                authors[userFullID].push(e);
                return false;
            }
            return true;
        });
    });

    const fetchOptions = {
        credentials: "include",
        redirect: "error",
        method: "GET",
        cache: "no-store",
    };

    const userSetInfoPromises = [];
    const setOfUsers = new Set();
    Object.keys(authors).forEach(userFullID => {
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
        const userOverviewPromises = [];
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
                const userData = userSetInfo[userFullID];
                if (userData.created_utc < Date.now() / 1000 - zombieAgeThreshold * 24 * 60 * 60 && userData.link_karma + userData.comment_karma < zombieKarmaThreshold) {
                    userOverviewPromises.push(fetch(`/user/${userData.name}/overview.json?limit=100`, fetchOptions)
                        .then(response => response.json())
                        .catch(error => console.log(error)));
                } else {
                    authors[userFullID].forEach(e => {
                        e.classList.add("zombieChecked");
                    });
                }
            });
        });

        Promise.all(userOverviewPromises).then(userOverviews => {
            userOverviews.forEach(userOverview => {
                if (userOverview.error) {
                    if (userOverview.error === 404 || userOverview.error === 403) {
                        return;
                    } else {
                        console.log(userOverview.error);
                        return;
                    }
                }

                authors[userOverview.data.children[0].data.author_fullname].forEach(e => {
                    e.classList.add("zombieChecked");

                    if (userOverview.data.dist < 100) {
                        const element = document.createElement("span");
                        element.classList.add("zombieTag");
                        element.innerHTML = "🧟";
                        element.title = `${userOverview.data.dist} items on account older than ${zombieAgeThreshold} days with less than ${zombieKarmaThreshold} karma.`;
                        e.after(element);
                    }
                });
            });
        });
    });
})();
