var enableProxy = function () {
    _proxy.update(function success() {
        controlCheck({
            controllable: true
        });
        iconSwitch(true);
    }, function error() {
        controlCheck({
            controllable: false
        });
    });
}

var disableProxy = function () {
    _proxy.disable(function () {
        iconSwitch(false);
    });
}

var controlCheck = function (details) {
    if (!details.controllable) {
        chrome['storage']['sync'].set({
            'proxIsOn': false,
            'proxIsControllable': false
        });
        badgeSwitch(true);
        return false;
    } else {
        chrome['storage']['sync'].set({
            'proxIsControllable': true
        });
        badgeSwitch(false);
        return true;
    }
};

var iconSwitch = function (isActive) {
    var iconPath = isActive ? '/img/128_on.png' : '/img/128_off.png';
    chrome['browserAction'].setIcon({
        path: iconPath
    });
};

var badgeSwitch = function (isVisible) {
    var badgeText = isVisible ? '!' : '';
    chrome['browserAction'].setBadgeText({
        text: badgeText
    });
    chrome['browserAction'].setBadgeBackgroundColor({
        color: '#F00'
    });
}

document.addEventListener("DOMContentLoaded", function (event) {
    _proxy.onControlChange(controlCheck);

    chrome['storage'].onChanged.addListener(function (change) {
        if (change.proxIsOn !== undefined) {
            if (change.proxIsOn.newValue === true) {
                enableProxy();
            } else {
                disableProxy();
            }
        }
    });

    _proxy.addSite({
        domain: "telegram.org"
    });

    chrome['storage']['sync'].get(function (change) {
        if (change.proxIsOn !== undefined) {
            if (change.proxIsOn === true) {
                enableProxy();
            } else {
                disableProxy();
            }
        } else {
            chrome['storage']['sync'].set({
                'proxIsOn': true
            });
        }
    });
});