javascript: (function () {
    const ages = {};
    const usersToRequest = new Set();

    function addToAges (user, createdUTC) {
        const age = parseInt((new Date().getTime() - new Date(createdUTC * 1000).getTime()) / (1000 * 60 * 60 * 24)).toString();
        if (!(age in ages)) {
            ages[age] = [user];
        } else {
            if (!ages[age].includes(user)) {
                ages[age].push(user);
            }
        }
    }

    function showDupeAges () {
        const dupeAges = Object.keys(ages).filter(age => ages[age].length > 1).sort((a, b) => ages[b].length - ages[a].length);
        if (!dupeAges.length) {
            alert("No duplicate ages found!");
        } else {
            let outputString = "";
            dupeAges.forEach(age => {
                outputString += `• ${age} days (${ages[age].length}): ${ages[age].join(", ")}\n`;
            });
            console.log(outputString);
            alert(outputString);
        }
    }

    document.querySelectorAll("#siteTable .author, .commentarea .author").forEach(e => {
        const user = e.textContent;
        if (user === "[deleted]") {
            return;
        }

        const ageElement = e.parentNode.querySelector(":scope > .karmaAgeTags > .karmaAgeTags-age");
        if (ageElement) {
            addToAges(user, parseInt(ageElement.dataset.createdutc));
        } else {
            usersToRequest.add(user);
        }
    });

    if (usersToRequest.size === 0) {
        showDupeAges();
    } else {
        const fetchOptions = {
            credentials: "include",
            redirect: "error",
            method: "GET",
            cache: "no-store",
        };

        const userAboutPromises = [];
        usersToRequest.forEach(user => {
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

                addToAges(userAbout.data.name, userAbout.data.created_utc);
            });
            showDupeAges();
        });
    }
})();
