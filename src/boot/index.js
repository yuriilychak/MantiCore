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
     * @desc Version of os that run application.
     * @type {string}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    OS_VERSION: "unknown",

    /**
     * @desc Os that run application
     * @type {MANTICORE.enumerator.system.OS}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    OS: OS.UNKNOWN,

    /**
     * @desc Browser that run application.
     * @type {MANTICORE.enumerator.system.BROWSER}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    BROWSER: BROWSER.UNKNOWN,

    /**
     * @desc Version of browser that run application.
     * @type {int}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    BROWSER_VERSION: -1,

    /**
     * @desc Client of application (Browser, electron, cordova etc)
     * @type {MANTICORE.enumerator.system.CLIENT}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    CLIENT: CLIENT.UNKNOWN,

    /**
     * @desc Is cookies enabled.
     * @type {boolean}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    COOKIES_ENABLED: false,

    /**
     * @desc Platform where run device (Desktop, mobile).
     * @type {MANTICORE.enumerator.system.PLATFORM}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    PLATFORM: PLATFORM.UNKNOWN,

    /**
     * @desc Flag is mouse input enabled.
     * @type {boolean}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    MOUSE_ENABLED: false,

    /**
     * @desc Flag is keyboard input enabled.
     * @type {boolean}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    KEYBOARD_ENABLED: false,

    /**
     * @desc Flag is touches input enabled.
     * @type {boolean}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    TOUCHES_ENABLED: false,

    /**
     * @desc Flag is accelerometer input enabled.
     * @type {boolean}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    ACCELEROMETER_ENABLED: false,

    /**
     * @desc Init engine
     * @function
     * @param {Function} callback
     * @memberOf MANTICORE.boot
     */

    init: function(callback) {

        const docEle = document.documentElement;

        /*
         * CAPABILITIES
         * -------------------------------------------------------------------------------------------------------------
         */

        this.TOUCHES_ENABLED = !Type.isUndefined(docEle["ontouchstart"]) || !Type.isUndefined(document["ontouchstart"]) || navigator.msPointerEnabled;
        this.MOUSE_ENABLED = !Type.isUndefined(docEle['onmouseup']);
        this.KEYBOARD_ENABLED = !Type.isUndefined(docEle['onkeyup']);
        this.ACCELEROMETER_ENABLED = Type.toBoolean(Type.setValue(window.DeviceMotionEvent, window.DeviceOrientationEvent));

        /*
         * CLIENT
         * -------------------------------------------------------------------------------------------------------------
         */

        let process;

        switch (true) {
            case (!Type.isUndefined(navigator["standalone"]) && navigator["standalone"]): {
                this.CLIENT = CLIENT.WEB_APP;
                break
            }
            case (!Type.isUndefined(window["cordova"])): {
                this.CLIENT = CLIENT.CORDOVA;
                break;
            }
            case (typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null): {
                if (!!process.versions.electron) {
                    this.CLIENT = CLIENT.ELECTRON;
                    break;
                }
                this.CLIENT = CLIENT.NODE;
                break;
            }
            case (!Type.isUndefined(navigator["isCocoonJS"])): {
                this.CLIENT = CLIENT.COCOON_JS;
                break;
            }
            default: {
                this.CLIENT = CLIENT.BROWSER;
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

        if (this.CLIENT === CLIENT.BROWSER) {
            switch (true) {
                case (verOffset = nAgt.indexOf('Opera')) !== -1: {
                    this.BROWSER = BROWSER.OPERA;
                    version = nAgt.substring(verOffset + 6);
                    if ((verOffset = nAgt.indexOf('Version')) !== -1) {
                        version = nAgt.substring(verOffset + 8);
                    }
                    break;
                }
                case (verOffset = nAgt.indexOf('OPR')) !== -1: {
                    this.BROWSER = BROWSER.OPERA;
                    version = nAgt.substring(verOffset + 4);
                    break;
                }
                case (verOffset = nAgt.indexOf('Edge')) !== -1: {
                    this.BROWSER = BROWSER.EDGE;
                    version = nAgt.substring(verOffset + 5);
                    break;
                }
                case (verOffset = nAgt.indexOf('MSIE')) !== -1: {
                    this.BROWSER = BROWSER.IE;
                    version = nAgt.substring(verOffset + 5);
                    break
                }
                case (verOffset = nAgt.indexOf('Chrome')) !== -1: {
                    this.BROWSER = BROWSER.CHROME;
                    version = nAgt.substring(verOffset + 7);
                    break;
                }
                case (verOffset = nAgt.indexOf('Safari')) !== -1: {
                    this.BROWSER = BROWSER.SAFARI;
                    version = nAgt.substring(verOffset + 7);
                    if ((verOffset = nAgt.indexOf('Version')) !== -1) {
                        version = nAgt.substring(verOffset + 8);
                    }
                    break;
                }
                case (verOffset = nAgt.indexOf('Firefox')) !== -1: {
                    this.BROWSER = BROWSER.FIREFOX;
                    version = nAgt.substring(verOffset + 8);
                    break;
                }
                case nAgt.indexOf('Trident/') !== -1: {
                    this.BROWSER = BROWSER.IE;
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

            this.BROWSER_VERSION = version;
        }

        /*
         * PLATFORM
         * -------------------------------------------------------------------------------------------------------------
         */
        this.PLATFORM = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer) ? PLATFORM.MOBILE : PLATFORM.DESKTOP;

        /*
         * COOKIES
         * -------------------------------------------------------------------------------------------------------------
         */
        if (Type.isUndefined(navigator.cookieEnabled)) {
            document.cookie = 'testcookie';
            this.COOKIES_ENABLED = document.cookie.indexOf('testcookie') !== -1;
        }
        else {
            this.COOKIES_ENABLED = navigator.cookieEnabled;
        }

        /*
         * SYSTEM
         * -------------------------------------------------------------------------------------------------------------
         */

        switch (true) {
            case /(Windows 10.0|Windows NT 10.0)/.test(nAgt): {
                this.OS = OS.WINDOWS;
                this.OS_VERSION = "10";
                break;
            }
            case /(Windows 8.1|Windows NT 6.3)/.test(nAgt): {
                this.OS = OS.WINDOWS;
                this.OS_VERSION = "8.1";
                break;
            }
            case /(Windows 8|Windows NT 6.2)/.test(nAgt): {
                this.OS = OS.WINDOWS;
                this.OS_VERSION = "8";
                break;
            }
            case /(Windows 7|Windows NT 6.1)/.test(nAgt): {
                this.OS = OS.WINDOWS;
                this.OS_VERSION = "7";
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
                this.OS = OS.WINDOWS;
                this.OS_VERSION = "Vista and earlier";
                break;
            }
            case /Android/.test(nAgt): {
                this.OS = OS.ANDROID;
                this.OS_VERSION = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;
            }
            case /OpenBSD/.test(nAgt): {
                this.OS = OS.BSD;
                this.OS_VERSION = "Unknown";
                break;
            }
            case /SunOS/.test(nAgt): {
                this.OS = OS.SUN;
                this.OS_VERSION = "Unknown";
                break;
            }
            case /(Linux|X11)/.test(nAgt): {
                this.OS = this.PLATFORM === PLATFORM.DESKTOP ? OS.LINUX : OS.TIZEN;
                this.OS_VERSION = "Unknown";
                break;
            }
            case /(iPhone|iPad|iPod)/.test(nAgt): {
                this.OS = OS.IOS;
                this.OS_VERSION = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
            }
            case /Mac OS X/.test(nAgt): {
                this.OS = OS.MAC_OS;
                this.OS_VERSION = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;
            }
            case /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/.test(nAgt): {
                this.OS = OS.MAC_OS;
                this.OS_VERSION = "Unknown";
                break;
            }
            case /UNIX/.test(nAgt): {
                this.OS = OS.UNIX;
                this.OS_VERSION = "Unknown";
                break;
            }
            case /QNX/.test(nAgt): {
                this.OS = OS.BLACKBERRY;
                this.OS_VERSION = "Unknown";
                break;
            }
            case /Windows Phone/i.test(ua) || (/IEMobile/i).test(ua): {
                this.OS = OS.WINDOWS_MOBILE;
                this.OS_VERSION = "Unknown";
            }
            case /Kindle/.test(nAgt) || (/\bKF[A-Z][A-Z]+/).test(ua) || (/Silk.*Mobile Safari/).test(nAgt): {
                this.OS = OS.KINDLE;
                this.OS_VERSION = "Unknown";
                break;
            }
            case /(CrOS)/.test(navigator.userAgent): {
                this.OS = OS.CHROME_OS;
                this.OS_VERSION = "Unknown";
                break;
            }
            case /BeOS/.test(nAgt):
            case /OS\/2/.test(nAgt): {
                this.OS = OS.DEPRECATED_OS;
                this.OS_VERSION = "Unknown";
                break;
            }
            case /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/.test(nAgt): {
                this.OS = OS.SEARCH_BOT;
                this.OS_VERSION = "Unknown";
                break;
            }
            default: {
                this.OS = OS.UNKNOWN;
                this.OS_VERSION = "Unknown";
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
        return this.PLATFORM === PLATFORM.MOBILE;
    },

    /**
     * @desc Returns is platform desktop.
     * @function
     * @public
     * @return {boolean}
     * @memberOf MANTICORE.boot
     */

    isDesktop: function () {
        return this.PLATFORM === PLATFORM.DESKTOP;
    },

    /**
     * @desc Dump information about platform.
     * @function
     * @public
     * @memberOf MANTICORE.boot
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
            Format.replace(template1, "OS", oses[this.OS], this.OS_VERSION) +
            Format.replace(template1, "Browser", browsers[this.BROWSER], this.BROWSER_VERSION.toString()) +
            Format.replace(template2, "Platform", platforms[this.PLATFORM]) +
            Format.replace(template2, "Client", clients[this.CLIENT]) +
            Format.replace(template2, "Cookies enabled", this.COOKIES_ENABLED.toString()) +
            Format.replace(template2, "Mouse enabled", this.MOUSE_ENABLED.toString()) +
            Format.replace(template2, "Touches enabled", this.TOUCHES_ENABLED.toString()) +
            Format.replace(template2, "Keyboard enabled", this.KEYBOARD_ENABLED.toString()) +
            Format.replace(template2, "Accelerometer enabled", this.ACCELEROMETER_ENABLED.toString())
        );

    }
};