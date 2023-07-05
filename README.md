# reddit-browser-tools
Rewritten versions of some of my bookmarklets and userscripts for Reddit. Some of their older versions may still be available on my gists. 

---

## Userscripts

Located in the userscripts folder, these run using the [Tampermonkey](https://tampermonkey.net/) extension. If you click on the raw button on the script page or one of the links below, Tampermonkey should automatically prompt you to install it.

- [**showregtime.user.js**](https://github.com/PitchforkAssistant/reddit-browser-tools/raw/main/userscripts/showregtime.user.js)  
    This script shows the user's registration time on their profile page without having to hover over the "redditor for x" text.  
    Shown in the bottom left of this screenshot.  
    ![](https://i.imgur.com/TWQibuj.png)

- [**showregtimemodmail.user.js**](https://github.com/PitchforkAssistant/reddit-browser-tools/raw/main/userscripts/showregtimemodmail.user.js)  
    This script shows the user's registration time on their modmail profile card, which is not available even upon hover by default.  
    Shown just above the view full profile link in this screenshot.  
    ![](https://i.imgur.com/ScckciY.png)

- [**resimagesize.user.js**](https://github.com/PitchforkAssistant/reddit-browser-tools/raw/main/userscripts/resimagesize.user.js)  
    This script adds a label with the image's original resolution to just above the image when a expanded with [RES](https://redditenhancementsuite.com/).   
    Shown just above the expanded image in this screenshot.  
    ![](https://i.imgur.com/MqokNVe.png)

- [**simplequeuefilters.user.js**](https://github.com/PitchforkAssistant/reddit-browser-tools/raw/main/userscripts/simplequeuefilters.user.js)  
    This script adds a few buttons to the [Toolbox](https://github.com/toolbox-team/reddit-moderator-toolbox) queue tools to quickly only show  certain types of posts. The buttons are currently User Reports, Mod Reports, AutoModerator Reports, Filtered, and Approved. Toolbox's built-in unhide all button reverses these filters.    
    Shown in the bottom right of this screenshot. 
    ![](https://i.imgur.com/VsH41Ca.png)

---

## Bookmarklets

Located in the bookmarklets folder, these are installed by adding them as a bookmark in your browser with the link set to their code. They run on the current page when clicked.

GitHub does not allow dragable javascript links in the readme, so you will have to copy the code from the raw link and paste it into a bookmark manually.

![](https://i.imgur.com/ce2rRaC.png)

- [**commentparentcheck.js**](https://github.com/PitchforkAssistant/reddit-browser-tools/raw/main/bookmarklets/commentparentcheck.js)  
    This bookmarklet checks if the parent post of every comment and adds a label if it no longer exists. This is most useful in the modqueue, but should work on any page with comments.  
    The screenshot below shows three different types of removed parent posts.
    ![](https://i.imgur.com/JmAf1p7.png)

- [**showkarmaandage.js**](https://github.com/PitchforkAssistant/reddit-browser-tools/raw/main/bookmarklets/showkarmaandage.js)  
    This bookmarklet adds karma and age tags to every user on a page. If this is ran first, the next bookmarklet will use data from these tags where possible.   
    The red, green, and blue tags after usernames in the screenshot below show link karma, comment karma, and account age respectively. 
    ![](https://i.imgur.com/1q9Jr1x.png)

- [**dupeagecheck.js**](https://github.com/PitchforkAssistant/reddit-browser-tools/raw/main/bookmarklets/dupeagecheck.js)  
    This bookmarklet checks every user on a page to check for users that have registered on the same day, helpful for finding spam rings. Uses data from karma and age tags where possible.  
    The information is shown as an alert and also logged to console.  
    ![](https://i.imgur.com/Tamr41R.png)

- [**zombiedetector.js**](https://github.com/PitchforkAssistant/reddit-browser-tools/raw/main/bookmarklets/zombiedetector.js)  
    This bookmarklet adds a symbol after every user on a page that is older than 30 days with less than 10k karma, but less than 100 posts or comments. This is useful for finding spam accounts that have been created a while ago but are only now being used.  
    The tag is shown in the screenshot below.  
    ![](https://i.imgur.com/w2eONmG.png)

- [**crossreferencesubreddits.js**](https://github.com/PitchforkAssistant/reddit-browser-tools/raw/main/bookmarklets/crossreferencesubreddits.js)  
    This bookmarklet checks every user on a page to see what other subreddits they have posted in, it then maps users to subreddits and displays subreddits that have multiple users in common. It excludes subreddits with more than 100k members. This is very useful for finding spam and astroturfing rings.  
    The information is shown as an alert and also logged to console.  
    ![](https://i.imgur.com/IB50WbP.png)

- [**screenshotcleanup.js**](https://github.com/PitchforkAssistant/reddit-browser-tools/raw/main/bookmarklets/screenshotcleanup.js)  
    This bookmarklet removes a lot of the clutter from a screenshot of an old Reddit page. It also adds buttons to temporarily hide certain content.  
    This is what the page looks like after the bookmarklet is ran, notice the [X] buttons on the top left of each comment.  
    ![](https://i.imgur.com/3kf6FPS.png)
