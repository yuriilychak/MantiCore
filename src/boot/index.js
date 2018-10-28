import Constant from "constant";
import Type from "util/Type";
import PLATFORM from "enumerator/system/Platform";
import OS from "enumerator/system/OS";
import CLIENT from "enumerator/system/Client";
import BROWSER from "enumerator/system/Browser";
import Logger from "logger";
import Format from "util/Format";

/**
 * @desc Boot section of engine.
 * @namespace boot
 * @memberOf MANTICORE
 */

export default {
    /**
     * @desc Init engine
     * @function
     * @param {Function} callback
     */

    init: function(callback) {
        /*
         * CLIENT
         * -------------------------------------------------------------------------------------------------------------
         */

        let process;

        switch (true) {
            case (!Type.isUndefined(navigator["standalone"]) && navigator["standalone"]): {
                Constant.CLIENT = CLIENT.WEB_APP;
                break
            }
            case (!Type.isUndefined(window["cordova"])): {
                Constant.CLIENT = CLIENT.CORDOVA;
                break;
            }
            case (typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null): {
                if (!!process.versions.electron) {
                    Constant.CLIENT = CLIENT.ELECTRON;
                    break;
                }
                Constant.CLIENT = CLIENT.NODE;
                break;
            }
            case (!Type.isUndefined(navigator["isCocoonJS"])): {
                Constant.CLIENT = CLIENT.COCOON_JS;
                break;
            }
            default: {
                Constant.CLIENT = CLIENT.BROWSER;
                break;
            }
        }

        /*
         * BROWSER
         * -------------------------------------------------------------------------------------------------------------
         */

        const nVer = navigator.appVersion;
        const nAgt = navigator.userAgent;
        let browser = navigator.appName;
        let version = '' + parseFloat(navigator.appVersion);
        let nameOffset, verOffset, ix;

        if (Constant.CLIENT === CLIENT.BROWSER) {
            switch (true) {
                case (verOffset = nAgt.indexOf('Opera')) !== -1: {
                    Constant.BROWSER = BROWSER.OPERA;
                    version = nAgt.substring(verOffset + 6);
                    if ((verOffset = nAgt.indexOf('Version')) !== -1) {
                        version = nAgt.substring(verOffset + 8);
                    }
                    break;
                }
                case (verOffset = nAgt.indexOf('OPR')) !== -1: {
                    Constant.BROWSER = BROWSER.OPERA;
                    version = nAgt.substring(verOffset + 4);
                    break;
                }
                case (verOffset = nAgt.indexOf('Edge')) !== -1: {
                    Constant.BROWSER = BROWSER.EDGE;
                    version = nAgt.substring(verOffset + 5);
                    break;
                }
                case (verOffset = nAgt.indexOf('MSIE')) !== -1: {
                    Constant.BROWSER = BROWSER.IE;
                    version = nAgt.substring(verOffset + 5);
                    break
                }
                case (verOffset = nAgt.indexOf('Chrome')) !== -1: {
                    Constant.BROWSER = BROWSER.CHROME;
                    version = nAgt.substring(verOffset + 7);
                    break;
                }
                case (verOffset = nAgt.indexOf('Safari')) !== -1: {
                    Constant.BROWSER = BROWSER.SAFARI;
                    version = nAgt.substring(verOffset + 7);
                    if ((verOffset = nAgt.indexOf('Version')) !== -1) {
                        version = nAgt.substring(verOffset + 8);
                    }
                    break;
                }
                case (verOffset = nAgt.indexOf('Firefox')) !== -1: {
                    Constant.BROWSER = BROWSER.FIREFOX;
                    version = nAgt.substring(verOffset + 8);
                    break;
                }
                case nAgt.indexOf('Trident/') !== -1: {
                    Constant.BROWSER = BROWSER.IE;
                    version = nAgt.substring(nAgt.indexOf('rv:') + 3);
                    break;
                }
                case (nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/')): {
                    browser = nAgt.substring(nameOffset, verOffset);
                    version = nAgt.substring(verOffset + 1);
                    break;
                }
                default: {

                }
            }
            // trim the version string
            if ((ix = version.indexOf(';')) !== -1) version = version.substring(0, ix);
            if ((ix = version.indexOf(' ')) !== -1) version = version.substring(0, ix);
            if ((ix = version.indexOf(')')) !== -1) version = version.substring(0, ix);

            version = parseInt('' + version, 10);
            if (isNaN(version)) {
                version = parseInt(navigator.appVersion, 10);
            }

            Constant.BROWSER_VERSION = version;
        }

        /*
         * PLATFORM
         * -------------------------------------------------------------------------------------------------------------
         */
        Constant.PLATFORM = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer) ? PLATFORM.MOBILE : PLATFORM.DESKTOP;

        /*
         * COOKIES
         * -------------------------------------------------------------------------------------------------------------
         */
        if (Type.isUndefined(navigator.cookieEnabled)) {
            document.cookie = 'testcookie';
            Constant.COOKIES_ENABLED = document.cookie.indexOf('testcookie') !== -1;
        }
        else {
            Constant.COOKIES_ENABLED = navigator.cookieEnabled;
        }

        /*
         * SYSTEM
         * -------------------------------------------------------------------------------------------------------------
         */

        switch (true) {
            case /(Windows 10.0|Windows NT 10.0)/.test(nAgt): {
                Constant.OS = OS.WINDOWS;
                Constant.OS_VERSION = "10";
                break;
            }
            case /(Windows 8.1|Windows NT 6.3)/.test(nAgt): {
                Constant.OS = OS.WINDOWS;
                Constant.OS_VERSION = "8.1";
                break;
            }
            case /(Windows 8|Windows NT 6.2)/.test(nAgt): {
                Constant.OS = OS.WINDOWS;
                Constant.OS_VERSION = "8";
                break;
            }
            case /(Windows 7|Windows NT 6.1)/.test(nAgt): {
                Constant.OS = OS.WINDOWS;
                Constant.OS_VERSION = "7";
                break;
            }
            case /Windows NT 6.0/.test(nAgt):
            case /Windows NT 5.2/.test(nAgt):
            case /(Windows NT 5.1|Windows XP)/.test(nAgt):
            case /(Windows NT 5.0|Windows 2000)/.test(nAgt):
            case /(Win 9x 4.90|Windows ME)/.test(nAgt):
            case /(Windows 98|Win98)/.test(nAgt):
            case /(Windows 95|Win95|Windows_95)/.test(nAgt):
            case /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/.test(nAgt):
            case /Windows CE/.test(nAgt):
            case /Win16/.test(nAgt): {
                Constant.OS = OS.WINDOWS;
                Constant.OS_VERSION = "Vista and earlier";
                break;
            }
            case /Android/.test(nAgt): {
                Constant.OS = OS.ANDROID;
                Constant.OS_VERSION = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;
            }
            case /OpenBSD/.test(nAgt): {
                Constant.OS = OS.BSD;
                Constant.OS_VERSION = "Unknown";
                break;
            }
            case /SunOS/.test(nAgt): {
                Constant.OS = OS.SUN;
                Constant.OS_VERSION = "Unknown";
                break;
            }
            case /(Linux|X11)/.test(nAgt): {
                Constant.OS = Constant.PLATFORM === PLATFORM.DESKTOP ? OS.LINUX : OS.TIZEN;
                Constant.OS_VERSION = "Unknown";
                break;
            }
            case /(iPhone|iPad|iPod)/.test(nAgt): {
                Constant.OS = OS.IOS;
                Constant.OS_VERSION = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
            }
            case /Mac OS X/.test(nAgt): {
                Constant.OS = OS.MAC_OS;
                Constant.OS_VERSION = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;
            }
            case /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/.test(nAgt): {
                Constant.OS = OS.MAC_OS;
                Constant.OS_VERSION = "Unknown";
                break;
            }
            case /UNIX/.test(nAgt): {
                Constant.OS = OS.UNIX;
                Constant.OS_VERSION = "Unknown";
                break;
            }
            case /QNX/.test(nAgt): {
                Constant.OS = OS.BLACKBERRY;
                Constant.OS_VERSION = "Unknown";
                break;
            }
            case /Windows Phone/i.test(ua) || (/IEMobile/i).test(ua): {
                Constant.OS = OS.WINDOWS_MOBILE;
                Constant.OS_VERSION = "Unknown";
            }
            case /Kindle/.test(nAgt) || (/\bKF[A-Z][A-Z]+/).test(ua) || (/Silk.*Mobile Safari/).test(nAgt): {
                Constant.OS = OS.KINDLE;
                Constant.OS_VERSION = "Unknown";
                break;
            }
            case /(CrOS)/.test(navigator.userAgent): {
                Constant.OS = OS.CHROME_OS;
                Constant.OS_VERSION = "Unknown";
                break;
            }
            case /BeOS/.test(nAgt):
            case /OS\/2/.test(nAgt): {
                Constant.OS = OS.DEPRECATED_OS;
                Constant.OS_VERSION = "Unknown";
                break;
            }
            case /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/.test(nAgt): {
                Constant.OS = OS.SEARCH_BOT;
                Constant.OS_VERSION = "Unknown";
                break;
            }
            default: {
                Constant.OS = OS.UNKNOWN;
                Constant.OS_VERSION = "Unknown";
                break;
            }
        }

        callback();
    },

    /**
     * @desc Returns is platform mobile.
     * @function
     * @public
     * @return {boolean}
     */

    isMobile: function () {
        return Constant.PLATFORM === PLATFORM.MOBILE;
    },

    /**
     * @desc Returns is platform desktop.
     * @function
     * @public
     * @return {boolean}
     */

    isDesktop: function () {
        return Constant.PLATFORM === PLATFORM.DESKTOP;
    },

    /**
     * @desc Dump information about platform.
     * @function
     * @public
     */

    dump: function() {
        const oses = [
            "Unknown", "IOS", "Android", "Windows", "Linux", "Windows Mobile", "Blackberry",
            "MacOS", "Unix", "BSD", "SUN", "Tizen", "ChromeOS", "Kindle", "Other", "Unknown"
        ];
        const browsers = ["Unknown", "Chrome", "Firefox", "Edge", "Opera", "Safari", "Internet Explorer"];
        const clients = ["Unknown", "Browser", "NodeJS", "Cordova", "Electron", "CocoonJS", "WebApp"];
        const platforms = ["Unknown", "Desktop", "Mobile"];
        const template1 = "{0}: {1} Version: {2}\n";
        const template2 = "{0}: {1}\n";

        Logger.log(
            Format.replace(template1, "OS", oses[Constant.OS], Constant.OS_VERSION) +
            Format.replace(template1, "Browser", browsers[Constant.BROWSER], Constant.BROWSER_VERSION) +
            Format.replace(template2, "Platform", platforms[Constant.PLATFORM]) +
            Format.replace(template2, "Client", clients[Constant.CLIENT]) +
            Format.replace(template2, "Cookies enabled", Constant.COOKIES_ENABLED.toString())
        );

    }
};