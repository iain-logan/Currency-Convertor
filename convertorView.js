/*jslint node: true, browser: true */
"use strict";

function ConvertorView() {

    var display = document.getElementById('quant'),
        clearButton = document.getElementById('clear'),
        evalButton  = document.getElementById('eval'),
        menu = document.getElementById('menu'),
        menuShown = false,
        menuToggle = document.getElementById('menuToggle'),
        curDisplay = document.getElementById('cur'),
        // Touch handler form mark
        addMouseAndTouchUp = function (element, handler) {
            var f = function (e) {
                    e.preventDefault();
                    handler(e.target);
                    return false;
                };
            element.addEventListener('mouseup', f, false);
            element.addEventListener('touchend', f, false);
        };

    this.makeMenu = function (currencies, cuts, home, vis) {
        var newMenu = document.createDocumentFragment(),
            icon = function (src, width, height, alt) {
                var result;
                result = document.createElement('img');
                result.setAttribute('src', src);
                result.setAttribute('width', width + 'px');
                result.setAttribute('height', height + 'px');
                result.setAttribute('alt', alt);
                return result;
            },
            i,
            nextLi,
            from,
            cutSelector,
            cut,
            to;
        nextLi = document.createElement('li');
        nextLi.innerHTML = 'Bank cut:';
        cutSelector = document.createElement('select');
        cutSelector.setAttribute('name', 'cuts');
        for (i = 0; i < cuts.length; i += 1) {
            cut = document.createElement('option');
            cut.setAttribute('value', cuts[i]);
            cut.innerHTML = cuts[i] + '%';
            cutSelector.appendChild(cut);
        }
        nextLi.appendChild(cutSelector);
        newMenu.appendChild(nextLi);
        nextLi = document.createElement('li');
        nextLi.appendChild(icon('img/flag.png', 60, 40));
        nextLi.appendChild(icon('img/home.png', 40, 40));
        nextLi.appendChild(icon('img/fly.png', 40, 40));
        newMenu.appendChild(nextLi);
        for (i = 0; i < currencies.length; i += 1) {
            nextLi = document.createElement('li');
            nextLi.appendChild(icon('img/' + currencies[i].currency + '.png', 60, 40, currencies[i].currency));
            from = document.createElement('input');
            from.setAttribute('type', 'radio');
            from.setAttribute('name', 'from');
            from.setAttribute('value', currencies[i].currency);
            if (home === currencies[i].currency) {
                from.checked = true;
            }
            to = document.createElement('input');
            to.setAttribute('type', 'radio');
            to.setAttribute('name', 'to');
            to.setAttribute('value', currencies[i].currency);
            if (vis === currencies[i].currency) {
                to.checked = true;
            }
            nextLi.appendChild(from);
            nextLi.appendChild(to);
            newMenu.appendChild(nextLi);
        }
        while (menu.hasChildNodes()) {
            menu.removeChild(menu.firstChild);
        }
        menu.appendChild(newMenu);
    };


    this.toggleMenu = function () {
        if (!menuShown) {
            // Draw menu
            menu.setAttribute('style', 'display: block;');
            history.pushState(null, null, '#menu');
        } else {
            // Hide menu
            window.history.back();
        }
        menuShown = !menuShown;
    };

    addMouseAndTouchUp(menuToggle, this.toggleMenu);
    window.addEventListener('popstate', function () {
        menu.setAttribute('style', 'display: none;');
        menuShown = false;
    });

    this.setEvalClickCallback = function (callback) {
        addMouseAndTouchUp(evalButton, callback);
    };

    this.setClearClickCallback = function (callback) {
        addMouseAndTouchUp(clearButton, callback);
    };

    this.setCutClickCallback = function (callback) {
        var cutOptions = document.querySelector('select[name="cuts"]');
        if (cutOptions === null) {
            return;
        }
        cutOptions.addEventListener('change', callback);
    };

    this.setNumClickCallback = function (callback) {
        var buttons = document.querySelectorAll('button[id^="but"]'),
            i;
        for (i = 0; i < buttons.length; i += 1) {
            addMouseAndTouchUp(buttons[i], callback);
        }
    };

    this.setSelectFromClickCallback = function (callback) {
        var fromRadios = document.querySelectorAll('input[name="from"]'),
            i;
        for (i = 0; i < fromRadios.length; i += 1) {
            addMouseAndTouchUp(fromRadios[i], callback);
        }
    };

    this.setSelectToClickCallback = function (callback) {
        var toRadios = document.querySelectorAll('input[name="to"]'),
            i;
        for (i = 0; i < toRadios.length; i += 1) {
            addMouseAndTouchUp(toRadios[i], callback);
        }
    };

    this.showValue = function (quant, currency) {
        display.innerHTML = quant;
        curDisplay.innerHTML = currency;
    };
}
