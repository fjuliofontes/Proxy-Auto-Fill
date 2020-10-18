# Proxy-Auto-Fill

## This extension will automatically authenticate to your proxy once you set up your credentials in the credentials tab.

### [Proxy Auto Fill](https://chrome.google.com/webstore/detail/proxy-auto-fill/kcfcmecfidkfjncphpbakdlpmjmkphhi)

#### Add a new bookmark with:
#### Name: credentials
#### URL: https://localhost/?user=[USERNAME]&pwd=[PASSWORD]

#### Launch Google-Chrome with flags: --args --proxy-server=http://[IP]:[PORT] "https://httpbin.org/ip"
