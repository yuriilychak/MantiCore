import Type from "util/Type";
import Math from "util/Math";
import Macro from "macro";
import PLATFORM from "enumerator/system/Platform";
import OS from "enumerator/system/OS";
import CLIENT from "enumerator/system/Client";
import BROWSER from "enumerator/system/Browser";
import Logger from "logger";
import Format from "util/Format";
import EventDispatcher from "eventDispatcher";
import SYSTEM_EVENT from "enumerator/SystemEvent";
import Timer from "timer";
import TEXTURE_FORMAT from "enumerator/TextureFormat";
import RESOLUTION from "enumerator/system/Resolution";

/**
 * @desc Boot section of engine.
 * @namespace boot
 * @memberOf MANTICORE
 */

export default {

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

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
     * @desc Flag is typed array such Int8Array are support.
     * @type {boolean}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    TYPED_ARRAY_SUPPORTED: false,

    /**
     * @desc Format of textures that support device.
     * @type {MANTICORE.enumerator.TEXTURE_FORMAT[]}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    SUPPORTED_FORMATS: [TEXTURE_FORMAT.PNG],

    /**
     * @desc Resolution of device. Need to load textures by quality.
     * @type {MANTICORE.enumerator.system.RESOLUTION}
     * @readonly
     * @memberOf MANTICORE.boot
     */

    RESOLUTION: RESOLUTION.SD,

    /**
     * PUBLIC FUNCTIONS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Init engine
     * @function
     * @param {Function} callback
     * @memberOf MANTICORE.boot
     */

    init: function(callback) {

        const docEle = document.documentElement;

        /*
         * SYSTEM LISTENERS
         * -------------------------------------------------------------------------------------------------------------
         */

        const browserPrefixes = ["moz", "ms", "o", "webkit"];
        const prefixCount = browserPrefixes.length;
        const suffix = "Hidden";
        let i, prefix;
        let resultPrefix = "";
        for (i = 0; i < prefixCount; ++i) {
            prefix = browserPrefixes[i];
            if (prefix + suffix in document) {
                resultPrefix = prefix;
                break;
            }
        }

        document.addEventListener(resultPrefix + "visibilitychange", this._onVisibleChangeHandler.bind(this), false);
        document.addEventListener("focus", this._onFocusHandler.bind(this), false);
        document.addEventListener("blur", this._onBlurHandler.bind(this), false);

        Timer.init();

        /*
         * CAPABILITIES
         * -------------------------------------------------------------------------------------------------------------
         */

        this.TOUCHES_ENABLED = Type.toBoolean(!Type.isUndefined(docEle["ontouchstart"]) || !Type.isUndefined(document["ontouchstart"]) || navigator.msPointerEnabled);
        this.MOUSE_ENABLED = !Type.isUndefined(docEle['onmouseup']);
        this.KEYBOARD_ENABLED = !Type.isUndefined(docEle['onkeyup']);
        this.ACCELEROMETER_ENABLED = Type.toBoolean(Type.setValue(window.DeviceMotionEvent, window.DeviceOrientationEvent));
        this.TYPED_ARRAY_SUPPORTED = "Uint8ClampedArray" in window; //Cause IE10 don't support this type of arrays.

        const maxDimension = Math.max(window.screen.height, window.screen.width);

        switch (true) {
            case maxDimension >= 1920: {
                this.RESOLUTION = RESOLUTION.UD;
                break;
            }
            case maxDimension >= 1024: {
                this.RESOLUTION = RESOLUTION.HD;
                break;
            }
            default: {
                this.RESOLUTION = RESOLUTION.SD;
                break;
            }
        }

        if (this.KEYBOARD_ENABLED && Macro.KEYBOARD_ENABLED) {
            const keyboardManager = PIXI.keyboardManager;
            keyboardManager.on('down', this._onKeyDownHandler, this);
            keyboardManager.on('pressed', this._onKeyPressedHandler, this);
            keyboardManager.on('released', this._onKeyReleaseHandler, this);

            if (Macro.BLOCK_BROWSER_HOT_KEYS) {
                window.addEventListener("keydown", this._onBrowserHotKeyHandler, false);
            }
        }

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
                if (Type.toBoolean(process.versions.electron)) {
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
                if (this.PLATFORM === PLATFORM.DESKTOP) {
                    this.OS = OS.LINUX;

                    let match;


                    switch (true) {
                        case Type.toBoolean(nAgt.match('CentOS')): {
                            this.OS_VERSION = 'CentOS';
                            if (match = /CentOS\/[0-9\.\-]+el([0-9_]+)/.exec(nAgt)) {
                                this.OS_VERSION += " " + match[1].replace(/_/g,'.');
                            }
                            break;
                        }
                        case Type.toBoolean(nAgt.match('Debian')): {
                            this.OS_VERSION = 'Debian';
                            break;
                        }
                        case Type.toBoolean(nAgt.match('Fedora')): {
                            this.OS_VERSION = 'Fedora';
                            if (match = /Fedora\/[0-9\.\-]+fc([0-9]+)/.exec(nAgt)) {
                                this.OS_VERSION += " " + match[1];
                            }
                            break;
                        }
                        case Type.toBoolean(nAgt.match('Gentoo')): {
                            this.OS_VERSION = 'Gentoo';
                            break;
                        }
                        case Type.toBoolean(nAgt.match('Kubuntu')): {
                            this.OS_VERSION = 'Kubuntu';
                            break;
                        }
                        case Type.toBoolean(nAgt.match('Mandriva Linux')): {
                            this.OS_VERSION = 'Mandriva';
                            if (match = /Mandriva Linux\/[0-9\.\-]+mdv([0-9]+)/.exec(nAgt)) {
                                this.os.version += " " + match[1];
                            }
                            break;
                        }
                        case Type.toBoolean(nAgt.match('Mageia')): {
                            this.OS_VERSION = 'Mageia';
                            if (match = /Mageia\/[0-9\.\-]+mga([0-9]+)/.exec(nAgt)) {
                                this.os.version += " " + match[1];
                            }
                            break;
                        }
                        case Type.toBoolean(nAgt.match('Red Hat')): {
                            this.OS_VERSION = 'Red Hat';
                            if (match = /Red Hat[^\/]*\/[0-9\.\-]+el([0-9_]+)/.exec(nAgt)) {
                                this.OS_VERSION += " " + match[1].replace(/_/g,'.');
                            }
                            break;
                        }
                        case Type.toBoolean(nAgt.match('Slackware')): {
                            this.OS_VERSION = 'Slackware';
                            break;
                        }
                        case Type.toBoolean(nAgt.match('SUSE')): {
                            this.OS_VERSION = 'SUSE';
                            break;
                        }
                        case Type.toBoolean(nAgt.match('Turbolinux')): {
                            this.OS_VERSION = 'Turbolinux';
                            break;
                        }
                        case Type.toBoolean(nAgt.match('Ubuntu')): {
                            this.OS_VERSION = 'Ubuntu';
                            if (match = /Ubuntu\/([0-9.]*)/.exec(nAgt)) {
                                this.OS_VERSION += " " + match[1];
                            }
                            break;
                        }
                        default: {
                            this.OS_VERSION = "Unknown";
                            break;
                        }
                    }

                }
                else {
                    this.OS = OS.TIZEN;
                    this.OS_VERSION = "Unknown";
                }

                break;
            }
            case /(iPhone|iPad|iPod)/.test(nAgt): {
                this.OS = OS.IOS;
                const osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
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

        const webP = new Image();

        webP.src = 'data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wA' + 'iMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA';
        webP.onload = webP.onerror = () => {
            if (webP.height === 2) {
                this.SUPPORTED_FORMATS.push(TEXTURE_FORMAT.WEB_P);
            }
            callback();
        };
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
        const resolution = this.RESOLUTION === RESOLUTION.UD ? "UD" : this.RESOLUTION === RESOLUTION.HD ? "HD" : "SD";

        Logger.log(
            Format.replace(template1, "OS", oses[this.OS], this.OS_VERSION) +
            Format.replace(template1, "Browser", browsers[this.BROWSER], this.BROWSER_VERSION.toString()) +
            Format.replace(template2, "Platform", platforms[this.PLATFORM]) +
            Format.replace(template2, "Client", clients[this.CLIENT]) +
            Format.replace(template2, "Cookies enabled", this.COOKIES_ENABLED.toString()) +
            Format.replace(template2, "Mouse enabled", this.MOUSE_ENABLED.toString()) +
            Format.replace(template2, "Touches enabled", this.TOUCHES_ENABLED.toString()) +
            Format.replace(template2, "Keyboard enabled", this.KEYBOARD_ENABLED.toString()) +
            Format.replace(template2, "Accelerometer enabled", this.ACCELEROMETER_ENABLED.toString()) +
            Format.replace(template2, "Supported texture formats", JSON.stringify(this.SUPPORTED_FORMATS)) +
            Format.replace(template2, "Resolution", resolution)
        );
    },

    /**
     * PRIVATE FUNCTIONS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @function
     * @param {int} key
     * @private
     */

    _onKeyDownHandler(key) {
        EventDispatcher.dispatch(SYSTEM_EVENT.KEY_DOWN, key);
    },

    /**
     * @function
     * @param {int} key
     * @private
     */

    _onKeyPressedHandler(key) {
        EventDispatcher.dispatch(SYSTEM_EVENT.KEY_PRESS, key);
    },

    /**
     * @function
     * @param {int} key
     * @private
     */

    _onKeyReleaseHandler(key) {
        EventDispatcher.dispatch(SYSTEM_EVENT.KEY_RELEASE, key);
    },

    /**
     * @function
     * @param {KeyboardEvent} event
     * @private
     */

    _onBrowserHotKeyHandler(event) {
        let keyCode;
        const charCodeArr = {
            " ": 32,
            "Spacebar": 32,
            "ArrowLeft": 37,
            "ArrowUp": 38,
            "ArrowRight": 39,
            "ArrowDown": 40,
        };
        if (event.key !== undefined){
            keyCode = charCodeArr[event.key] || event.key.charCodeAt(0);
        }
        else{
            keyCode = event.which || event.charCode || event.keyCode || 0;
        }
        // space and arrow keys
        const blockKeys = [32, 37, 38, 39, 40];
        if(blockKeys.indexOf(keyCode) > -1) {
            event.preventDefault();
        }
    },

    /**
     * @desc Calls when user change tab.
     * @function
     * @private
     */

    _onVisibleChangeHandler: function() {
        EventDispatcher.dispatch(document.hidden ? SYSTEM_EVENT.HIDDEN : SYSTEM_EVENT.VISIBLE);
    },

    /**
     * @desc Calls when user focuse on tab.
     * @function
     * @private
     */

    _onFocusHandler: function () {
        EventDispatcher.dispatch(SYSTEM_EVENT.FOCUS);
    },

    /**
     * @desc Calls when user focus on other window.
     * @function
     * @private
     */

    _onBlurHandler: function () {
        EventDispatcher.dispatch(SYSTEM_EVENT.BLUR);
    }
};