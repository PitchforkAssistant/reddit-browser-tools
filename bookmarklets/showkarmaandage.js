javascript: (function () {
    const users = new Set();
    const authorElements = {};

    document.querySelectorAll(".author").forEach(e => {
        if (!e.parentNode.classList.contains("karmaAgeTags-added")) {
            const user = e.textContent;
            if (user === "[deleted]") {
                return;
            }
            users.add(user);
            if (!(user in authorElements)) {
                authorElements[user] = [];
            }
            authorElements[user].push(e);
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

    const userAboutPromises = [];
    users.forEach(user => {
        userAboutPromises.push(fetch(`/user/${user}/about.json`, fetchOptions)
            .then(response => response.json())
            .catch(error => console.log(error)));
    });

    Promise.all(userAboutPromises).then(userAbouts => {
        userAbouts.forEach(userAbout => {
            if (userAbout.error) {
                if (userAbout.error === 404 || userAbout.error === 403) {
                    return;
                } else {
                    console.log(userAbout.error);
                    return;
                }
            }

            const linkKarma = userAbout.data.link_karma;
            const commentKarma = userAbout.data.comment_karma;
            const createdUTC = userAbout.data.created_utc;
            const ageDays = parseInt((new Date().getTime() - new Date(createdUTC * 1000).getTime()) / (1000 * 60 * 60 * 24));

            const karmaAgeTag = document.createElement("span");
            karmaAgeTag.classList.add("karmaAgeTags");
            karmaAgeTag.dataset.totalkarma = linkKarma + commentKarma;
            karmaAgeTag.innerHTML = `(<span class="karmaAgeTags-linkKarma" data-linkkarma=${linkKarma}><b>l: </b>${linkKarma}</span> /` +
                                    ` <span class="karmaAgeTags-commentKarma" data-commentkarma=${commentKarma}><b>c: </b>${commentKarma}</span> /` +
                                    ` <span class="karmaAgeTags-age" data-agedays=${ageDays} data-createdutc=${createdUTC} title="${new Date(createdUTC * 1000).toUTCString().replace("GMT", "UTC")}"><b>d: </b>${ageDays} days</span>) `;

            authorElements[userAbout.data.name].forEach(authorElement => {
                authorElement.parentNode.classList.add("karmaAgeTags-added");
                authorElement.after(karmaAgeTag.cloneNode(true));
            });
        });
    });
})();
