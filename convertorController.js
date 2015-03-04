/*jslint node: true, browser: true */
"use strict";

function ConvertorController() {
    var convertorView = new ConvertorView(),
        convertorModel = new ConvertorModel(),
        updateConvertorDisplay = function () {
            convertorView.showValue(convertorModel.getCurrentValue(), convertorModel.getHome());
        },
        evalConvertor = function () {
            convertorView.showValue(convertorModel.evaluate(), convertorModel.getVis());
        },
        clearConvertor = function () {
            convertorModel.clear();
        },
        setHome = function (currency) {
            convertorModel.setHome(currency);
        },
        setVis = function (currency) {
            convertorModel.setVis(currency);
        },
        setCut = function (cut) {
            convertorModel.setCut(cut);
        },
        addDigit = function (digit) {
            convertorModel.addDigit(digit);
        },
        makeMenu = function () {
            convertorView.makeMenu(convertorModel.getCurrencies(), convertorModel.getCuts(), convertorModel.getHome(), convertorModel.getVis());
        };

    this.init = function () {
        convertorView.setEvalClickCallback(function () {
            evalConvertor();
        });
        convertorView.setClearClickCallback(function () {
            clearConvertor();
            updateConvertorDisplay();
        });
        convertorView.setNumClickCallback(function (element) {
            addDigit(element.innerHTML);
            updateConvertorDisplay();
        });
        convertorModel.fetchData(function () {
            makeMenu();
            convertorView.setSelectFromClickCallback(function (element) {
                setHome(element.value);
                element.checked = true;
                updateConvertorDisplay();
            });
            convertorView.setSelectToClickCallback(function (element) {
                setVis(element.value);
                element.checked = true;
                updateConvertorDisplay();
            });
            convertorView.setCutClickCallback(function () {
                setCut(this.value);
            });
        });
        updateConvertorDisplay();
    };
}
var convertorController = new ConvertorController();
window.addEventListener('load', convertorController.init(), false);
