javascript: (function () {
    const ages = {};
    const usersFullIDsToRequest = new Set();

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

    document.querySelectorAll("#siteTable .author[class*= id-t2], .commentarea .author[class*= id-t2]").forEach(e => {
        const user = e.textContent;
        if (user === "[deleted]") {
            return;
        }

        const ageElement = e.parentNode.querySelector(":scope > .karmaAgeTags > .karmaAgeTags-age");
        if (ageElement) {
            addToAges(user, parseInt(ageElement.dataset.createdutc));
        } else {
            e.className.split(" ").every(c => {
                if (c.startsWith("id-t2_")) {
                    const userFullID = c.replace("id-", "");
                    usersFullIDsToRequest.add(userFullID);
                    return false;
                }
                return true;
            });
        }
    });

    if (usersFullIDsToRequest.size === 0) {
        showDupeAges();
    } else {
        const fetchOptions = {
            credentials: "include",
            redirect: "error",
            method: "GET",
            cache: "no-store",
        };

        const userSetInfoPromises = [];
        const setOfUsers = new Set();
        usersFullIDsToRequest.forEach(userFullID => {
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

                Object.values(userSetInfo).forEach(user => {
                    addToAges(user.name, user.created_utc);
                });
            });

            showDupeAges();
        });
    }
})();
