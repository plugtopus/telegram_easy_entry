document.addEventListener("DOMContentLoaded", function(event) {
    chrome['storage'].sync.get(function(change) {
        var status = document.querySelector('#checkbox');
        var sites = document.querySelectorAll('.list-item');
        var txt = document.querySelector('.error');
        if (change.proxIsControllable) {
            txt.style.display = 'none';
            status.removeAttribute('disabled');
            if (change.proxIsOn !== undefined) {
                if (change.proxIsOn) {
                    status.setAttribute('checked', 'checked');
                    for (var i = 0; i < sites.length; i++) {
                        sites[i].classList.remove('off');
                        sites[i].classList.add('on');
                    }
                } else {
                    status.removeAttribute('checked');
                    for (var i = 0; i < sites.length; i++) {
                        sites[i].classList.remove('on');
                        sites[i].classList.add('off');
                    }
                }
            }
        } else {
            status.setAttribute('disabled', '');
            txt.style.display = 'block';
            txt.textContent = chrome.i18n.getMessage("popupMessage_error");
        }

        document.querySelector('.header-text').textContent = chrome.i18n.getMessage("popupMessage_info");
    });
});

var stop_enabling = false;
document.querySelector('#checkbox').addEventListener('click', function(e) {
    var a = e.target.checked;
    chrome.storage.sync.set({
        'proxIsOn': !!a
    });
    var sites = document.querySelectorAll('.list-item');
    if (!!a) {
        stop_enabling = false;
        for (var i = 0; i < sites.length; i++) {
            (function(site) {
                setTimeout(function() {
                    if (stop_enabling) {
                        return;
                    }
                    site.classList.remove('off');
                    site.classList.add('on');
                }, Math.random() * 1000 + 300);
            })(sites[i]);
        }
    } else {
        stop_enabling = true;
        for (var i = 0; i < sites.length; i++) {
            sites[i].classList.remove('on');
            sites[i].classList.add('off');
        }
    }
});