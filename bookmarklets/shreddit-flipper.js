javascript: (function () {
    // Swapt these depending on your settings
    const oldHostname = "www.reddit.com";
    const newHostname = "sh.reddit.com";

    function getOldQueueSubreddits (url) {
        /* This can require more complex logic if negative multireddit names are used, also the params and path are very fucking different. */
        if (url.toString().match("/r/mod/about/")) {
            return;
        }

        if (url.toString().match("/r/([A-Za-z0-9_]+)/about/")) {
            return [url.toString().match("/r/([A-Za-z0-9_]+)/about/")[1]];
        }

        if (url.toString().match("/r/([A-Za-z0-9_+]+)/about/")) {
            return [url.toString().match("/r/([A-Za-z0-9_+]+)/about/")[1].split("+")];
        }

        /* Now this is the hacky part... instead of making any of this async, we get the computed subreddits using document.querySelectorAll("body .side .sidecontentbox .content .subscription-box ul li .title") */
        if (url.toString().match("/r/mod-([A-Za-z0-9_-]+)/about/")) {
            const subreddits = [];
            const subredditElements = document.querySelectorAll("body .side .sidecontentbox .content .subscription-box ul li .title");
            if (!subredditElements || subredditElements.length === 0) {
                return; /* Default queue subreddit if the multireddit contents box is missing. */
            }
            subredditElements.forEach(el => subreddits.push(el.textContent.trim()));
            return subreddits;
        }
        return; /* Default queue subreddit for new. */
    }

    function oldQueueUrlToNewQueueUrl (url) {
        const newUrl = new URL(`https://${newHostname}/mod/`);

        const subreddits = getOldQueueSubreddits(url);
        if (subreddits && subreddits.length > 1) {
            newUrl.pathname += "queue/";
            newUrl.searchParams.set("selectedSubreddits", subreddits.join(","));
        } else if (subreddits && subreddits.length === 1) {
            newUrl.pathname += `${subreddits[0]}/queue/`;
        } else {
            newUrl.pathname += "queue/";
        }

        if (url.toString().match("/about/edited")) {
            newUrl.searchParams.set("queueType", "edited");
        } else if (url.toString().match("/about/unmoderated")) {
            newUrl.searchParams.set("queueType", "unmoderated");
        } else if (url.toString().match("/about/reports")) {
            newUrl.searchParams.set("queueType", "reported");
        } else if (url.toString().match("/about/spam")) {
            newUrl.searchParams.set("queueType", "removed");
        } else {
            newUrl.searchParams.set("queueType", "mod");
        }

        newUrl.searchParams.set("first", "100");
        if (url.searchParams.has("only")) {
            if (url.searchParams.get("only") === "comments") {
                newUrl.searchParams.set("contentType", "comments");
            } else if (url.searchParams.get("only") === "links") {
                newUrl.searchParams.set("contentType", "posts");
            }
        } else {
            newUrl.searchParams.set("contentType", "all");
        }

        return newUrl.toString();
    }

    const oldToNewMappings = {
        "/r/([^/]+)/about/banned": url => url.toString().replace(/\/r\/([^/]+)\/about\/banned/, "/mod/$1/banned"),
        "/r/([^/]+)/about/muted": url => url.toString().replace(/\/r\/([^/]+)\/about\/muted/, "/mod/$1/muted"),
        "/r/([^/]+)/about/rules": url => url.toString().replace(/\/r\/([^/]+)\/about\/rules/, "/mod/$1/rules"),
        "/r/([^/]+)/about/moderators": url => url.toString().replace(/\/r\/([^/]+)\/about\/moderators/, "/mod/$1/moderators"),
        "/r/([^/]+)/about/contributors": url => url.toString().replace(/\/r\/([^/]+)\/about\/contributors/, "/mod/$1/approved-users"),
        "/r/([^/]+)/about/edit": url => url.toString().replace(/\/r\/([^/]+)\/about\/edit/, "/mod/$1/community"),
        "/r/([^/]+)/about/traffic": url => url.toString().replace(/\/r\/([^/]+)\/about\/traffic/, "/mod/$1/insights"),
        "/r/([^/]+)/about/flair(/#grant)?": url => url.toString().replace(/\/r\/([^/]+)\/about\/flair(\/#grant)?/, "/mod/$1/flairedusers"),
        "/r/([^/]+)/about/flair#link_templates": url => url.toString().replace(/\/r\/([^/]+)\/about\/flair\/#link_templates/, "/mod/$1/postflair"),
        "/r/([^/]+)/about/flair#templates": url => url.toString().replace(/\/r\/([^/]+)\/about\/flair\/#templates/, "/mod/$1/userflair"),
        "/r/([^/]+)/about/(modqueue|unmoderated|modqueue|reports|spam|edited)": url => oldQueueUrlToNewQueueUrl(url),
    };

    function getNewQueueSubreddits (url) {
        if (url.toString().match("/mod/([^/]+)/queue")) {
            return [url.toString().match("/mod/([^/]+)/queue")[1]];
        }

        if (url.searchParams.has("selectedSubreddits")) {
            return url.searchParams.get("selectedSubreddits").split(",");
        }

        return ["mod"]; /* Default queue subreddit for old. */
    }

    function newQueueUrlToOldQueueUrl (url) {
        /* This is slightly less complex than the old->new direction, mostly because multireddit negations are not possible. */
        let newPath = "/r/";
        const subreddits = getNewQueueSubreddits(url);
        newPath += `${subreddits.join("+").replace("u/", "u_")}/about`;

        switch (url.searchParams.get("queueType")) {
        case "edited":
            newPath += "/edited";
            break;
        case "unmoderated":
            newPath += "/unmoderated";
            break;
        case "reported":
            newPath += "/reports";
            break;
        case "removed":
            newPath += "/spam";
            break;
        default:
            newPath += "/modqueue";
            break;
        }

        if (url.searchParams.get("contentType") === "comments") {
            newPath += "?only=comments";
        } else if (url.searchParams.get("contentType") === "posts") {
            newPath += "?only=links";
        }

        return `https://${oldHostname}${newPath}`;
    }

    const newToOldMappings = {
        "/mod/([^/]+)/banned": url => url.toString().replace(/\/mod\/([^/]+)\/banned/, "/r/$1/about/banned"),
        "/mod/([^/]+)/muted": url => url.toString().replace(/\/mod\/([^/]+)\/muted/, "/r/$1/about/muted"),
        "/mod/([^/]+)/rules": url => url.toString().replace(/\/mod\/([^/]+)\/rules/, "/r/$1/about/rules"),
        "/mod/([^/]+)/moderators": url => url.toString().replace(/\/mod\/([^/]+)\/moderators/, "/r/$1/about/moderators"),
        "/mod/([^/]+)/approved-users": url => url.toString().replace(/\/mod\/([^/]+)\/approved-users/, "/r/$1/about/contributors"),
        "/mod/([^/]+)/community": url => url.toString().replace(/\/mod\/([^/]+)\/community/, "/r/$1/about/edit"),
        "/mod/([^/]+)/insights(/team_health|/reports_and_removals)?": url => url.toString().replace(/\/mod\/([^/]+)\/insights(\/team_health|\/reports_and_removals)?/, "/r/$1/about/traffic"),
        "/mod/([^/]+)/flairedusers": url => url.toString().replace(/\/mod\/([^/]+)\/flairedusers/, "/r/$1/about/flair"),
        "/mod/([^/]+)/postflair": url => url.toString().replace(/\/mod\/([^/]+)\/postflair/, "/r/$1/about/flair#link_templates"),
        "/mod/([^/]+)/userflair": url => url.toString().replace(/\/mod\/([^/]+)\/userflair/, "/r/$1/about/flair#templates"),
        "/mod/(([^/]+)/)?queue": url => newQueueUrlToOldQueueUrl(url),
    };

    function convertRedditUri (url) {
        if (url.hostname === oldHostname) {
            for (const [oldPattern, transformFunction] of Object.entries(oldToNewMappings)) {
                if (url.toString().match(oldPattern)) {
                    console.log(`Matched old pattern: ${oldPattern}`);
                    return transformFunction(url).replace(oldHostname, newHostname);
                }
            }
            return url.toString().replace(oldHostname, newHostname);
        } else if (url.hostname === newHostname) {
            for (const [newPattern, transformFunction] of Object.entries(newToOldMappings)) {
                if (url.toString().match(newPattern)) {
                    console.log(`Matched new pattern: ${newPattern}`);
                    return transformFunction(url).replace(newHostname, oldHostname);
                }
            }
            return url.toString().replace(newHostname, oldHostname);
        } else {
            throw new Error(`Unsupported hostname: ${url.hostname}`);
        }
    }

    console.log(`Current URL: ${location.href}`);

    const newUri = convertRedditUri(new URL(location.href));
    location.href = newUri;
})();
