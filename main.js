var NOTIFICATION_ID = 'proxyautofill';
var DEFAULT_RETRY_ATTEMPTS = 10;

var calls = {};

var proxyUser = '',
    proxyPwd = '';

chrome.bookmarks.search('credentials', function(results) {
    if (typeof results !== 'undefined') {
        var crede = (new URL(results[0].url)).searchParams;
        if ((crede.get('user') !== null) && (crede.get('pwd') !== null)) {
            proxyUser = crede.get('user');
            proxyPwd = crede.get('pwd');
        }
    }
});


// Remove saved credentials on firts start
chrome.runtime.onStartup.addListener(function() {});

// Shows settings on install.
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason && (details.reason === 'install') || (details.reason === 'update')) {}
});

// Show settings when clicking on the icon.
chrome.browserAction.onClicked.addListener(function() {});

/* Core */
chrome.webRequest.onAuthRequired.addListener(
    function(details) {
        console.log('Or maybe not...');
        // try to authenticate 
        var idstr = details.requestId.toString();

        if (details.isProxy === true) {

            //console.log('AUTH - ' + details.requestId);
            //console.log(JSON.stringify(details));

            if (!(idstr in calls)) {
                calls[idstr] = 0;
            }
            calls[idstr] = calls[idstr] + 1;

            console.log(calls[idstr]);

            if (calls[idstr] >= DEFAULT_RETRY_ATTEMPTS) {
                chrome.notifications.create(NOTIFICATION_ID, {
                    'type': 'basic',
                    'iconUrl': 'icon_locked_128.png',
                    'title': 'Proxy Auto Auth error',
                    'message': 'A lot of Proxy Authentication requests have been detected. There is probably a mistake in your credentials. For your safety, the extension has been temporary locked. To unlock it, click the save button in the options.',
                    'isClickable': true,
                    'priority': 2
                }, function(id) {
                    //console.log('notification callback'); 
                });

                calls = {};
                return ({
                    cancel: true
                });
            }

            if (proxyUser && proxyPwd) {
                return ({
                    authCredentials: {
                        'username': proxyUser,
                        'password': proxyPwd
                    }
                });
            }
        }

        /*
        chrome.tabs.query({}, function(tabs) {
            //var args = { user: null, pwd: null }, argName, regExp, match;
            //tabs.forEach(tab => alert(tab.pendingUrl))

            tabs.forEach(tab => {
                res = (new URL(tab.pendingUrl)).searchParams
                if ((res.get('user') != null) && (res.get('pwd') != null)) {
                    localStorage["proxy_retry"] = DEFAULT_RETRY_ATTEMPTS;
                    localStorage["proxy_login"] = res.get('user');
                    localStorage["proxy_password"] = res.get('pwd');
                }
            });
		});
		*/

    }, { urls: ["<all_urls>"] }, ["blocking"]
);