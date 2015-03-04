
/*jslint node: true, browser: true */
"use strict";

function ConvertorModel() {
    var value = '',
        homeCur = 'GBP',
        visCur = 'EUR',
        cuts = [0, 2, 4, 6],
        bankCut = cuts[0],
        recentEval = false,
        makeCurrency = function (currency, rate) {
            var result = {};
            result.currency = currency;
            result.rate = rate;
            return result;
        },
        currencies = [];

    this.getCurrencies = function () {
        return currencies;
    };

    this.setHome = function (newHomeCur) {
        homeCur = newHomeCur;
    };

    this.getHome = function () {
        return homeCur;
    };

    this.getCuts = function () {
        return cuts;
    };

    this.setCut = function (newCut) {
        bankCut = newCut;
    };

    this.getCut = function () {
        return bankCut;
    };

    this.setVis = function (newVisCur) {
        visCur = newVisCur;
    };

    this.getVis = function () {
        return visCur;
    };

    this.getCurrentValue = function () {
        return value;
    };

    this.clear = function () {
        value = '';
    };

    this.lookUpRate = function (currency) {
        var i;
        for (i = 0; i < currencies.length; i += 1) {
            if (currencies[i].currency === currency) {
                return currencies[i].rate;
            }
        }
        return -1;
    };

    this.fetchData = function (callback) {
        var rq = new XMLHttpRequest(),
            currency,
            rate,
            newCurrencies = [],
            stored = localStorage.rates ? JSON.parse(localStorage.rates) : false;
        // We have a wee check to see if we have anything stored, and then check if it is
        // less than 24 hours old. Otherwise do the get request.
        if (stored && ((Date.now() - stored[0]) < (1000 * 60 * 60 * 24))) {
            currencies = stored[1];
            callback();
        } else {
            rq.open('GET', 'https://devweb2014.cis.strath.ac.uk/~aes02112/ecbxml.php', true);
            rq.onreadystatechange = function () {
                var result,
                    i;
                if (rq.readyState === 4) {
                    if (rq.status === 200) {
                        result = rq.responseXML;
                        newCurrencies = result.querySelectorAll('Cube[currency]');
                        currencies.length = 0;
                        currencies.push(makeCurrency('EUR', 1));
                        for (i = 0; i < newCurrencies.length; i += 1) {
                            currency = newCurrencies[i].getAttribute('currency');
                            rate = newCurrencies[i].getAttribute('rate');
                            currencies.push(makeCurrency(currency, rate));
                        }
                        callback();
                        localStorage.rates = JSON.stringify([ Date.now(), currencies]);
                    } else {
                        // If we want to update currencies, but the get request fails, continue to use
                        // the old values.
                        currencies = stored[i] === null ? [] : stored[i];
                    }
                }
            };
            rq.send();
        }
    };

    this.evaluate = function () {
        var currentRate = this.lookUpRate(homeCur),
            newRate = this.lookUpRate(visCur);
        recentEval = true;
        return Math.floor((value / currentRate) * newRate * (1 - bankCut / 100));
    };

    this.addDigit = function (digit) {
        if (recentEval) {
            this.clear();
            recentEval = false;
        }
        if (value === '' && digit === '0') {
            return;
        }
        value += String() + digit;
    };

}
