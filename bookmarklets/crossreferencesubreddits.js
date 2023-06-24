javascript: (function () {
    const subCommonUserMinimum = 3; /* minimum number of sub users in common to be listed */
    const excludedSubsSize = 100000; /* minimum number of subscribers to exclude */
    const excludedSubs = new Set([]); /* subreddits to exclude by default */

    const users = new Set();
    document.querySelectorAll(".thing").forEach(e => {
        const user = e.dataset.author;
        if (user !== "[deleted]") {
            users.add(user);
        }

        const sub = e.dataset.subreddit;
        excludedSubs.add(sub);
    });

    const fetchOptions = {
        credentials: "include",
        redirect: "error",
        method: "GET",
        cache: "no-store",
    };

    const userPagePromises = [];
    users.forEach(user => {
        userPagePromises.push(fetch(`/user/${user}/overview.json?sort=new&limit=100`, fetchOptions)
            .then(response => response.json())
            .catch(error => console.log(error)));
    });

    Promise.all(userPagePromises).then(userPages => {
        const subs = {};
        userPages.forEach(userPage => {
            if (userPage.error) {
                if (userPage.error === 404 || userPage.error === 403) {
                    return;
                } else {
                    console.log(userPage.error);
                    return;
                }
            }

            userPage.data.children.forEach(post => {
                const sub = post.data.subreddit;
                if (!(sub in subs)) {
                    subs[sub] = [post.data.author];
                } else if (!subs[sub].includes(post.data.author)) {
                    subs[sub].push(post.data.author);
                }
            });
        });
        return subs;
    })
        .then(subs => {
            const commonSubs = Object.keys(subs).filter(sub => subs[sub].length >= subCommonUserMinimum && !excludedSubs.has(sub)).sort((a, b) => subs[b].length - subs[a].length);
            const subredditPromises = [];
            commonSubs.forEach(sub => {
                subredditPromises.push(fetch(`/r/${sub}/about.json`, fetchOptions).then(response => response.json()));
            });
            Promise.all(subredditPromises).then(subreddits => {
                let outputString = "";
                subreddits.forEach(subreddit => {
                    if (subreddit.error) {
                        console.log(subreddit.error);
                        return;
                    }
                    const sub = subreddit.data.display_name;
                    if (subreddit.data.subscribers < excludedSubsSize) {
                        outputString += `• ${sub} (${subs[sub].length}): ${subs[sub].join(", ")}\n`;
                    }
                });

                if (!commonSubs.length) {
                    alert("No common subreddits found!");
                } else {
                    console.log(outputString);
                    alert(outputString);
                }
            });
        });
})();
