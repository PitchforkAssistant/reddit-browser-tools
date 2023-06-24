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
    document.querySelectorAll(".tagline>.author:not(.zombieChecked)").forEach(e => {
        const user = e.textContent;
        if (!(user in authors)) {
            authors[user] = [];
        }
        authors[user].push(e);
    });

    const fetchOptions = {
        credentials: "include",
        redirect: "error",
        method: "GET",
        cache: "no-store",
    };

    const userAboutPromises = [];
    Object.keys(authors).forEach(user => {
        userAboutPromises.push(fetch(`/user/${user}/about.json`, fetchOptions)
            .then(response => response.json())
            .catch(error => console.log(error)));
    });

    Promise.all(userAboutPromises).then(users => {
        const userOverviewPromises = [];
        users.forEach(user => {
            if (user.error) {
                if (user.error === 404 || user.error === 403) {
                    return;
                } else {
                    console.log(user.error);
                    return;
                }
            }

            if (user.data.created_utc < Date.now() / 1000 - zombieAgeThreshold * 24 * 60 * 60 && user.data.link_karma + user.data.comment_karma < zombieKarmaThreshold) {
                userOverviewPromises.push(fetch(`/user/${user.data.name}/overview.json?limit=100`, fetchOptions)
                    .then(response => response.json())
                    .catch(error => console.log(error)));
            } else {
                authors[user.data.name].forEach(e => {
                    e.classList.add("zombieChecked");
                });
            }
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

                authors[userOverview.data.children[0].data.author].forEach(e => {
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
