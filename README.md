# Dedistract

Stupid simple site "blocker" Chrome extension. "blocker" is in quotes because 
you can still use the sites, you just have to click and hold on a message for 
10s, which should help kill your muscle memory for opening up Reddit, Hacker 
News, or your Facebook feed.

To install, git clone this repository, then install the extension as an unpacked 
plugin.

See: https://developer.chrome.com/extensions/getstarted#unpacked

The source is simple enough that you should be able to read the whole thing in 
about 5 minutes. < 100 lines excluding jQuery. You replace the jQuery with your 
own if you're super paranoid :)

To customize the message, edit the message at the top of `shared.js`.
