"use strict";

const logOutButton = new LogoutButton();

logOutButton.action = function () {
    ApiConnector.logout((result) => {if (result.success) location.reload()});
}

ApiConnector.current((result) => {if (result.success) ProfileWidget.showProfile(result.data)});

const ratesBoard = new RatesBoard();

function updateCurrencyRates(ratesBoard) {
    ApiConnector.getStocks((result) => {if (result.success) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(result.data);
        }
    });
}

updateCurrencyRates(ratesBoard);

setInterval(updateCurrencyRates, 60000, ratesBoard);

function checkResult(result, successMsg) {
    if (result.success) {
        ProfileWidget.showProfile(result.data);
        this.setMessage(false, successMsg);
    } else {
        this.setMessage(true, result.error);
    }
}

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = function (data) {
    ApiConnector.addMoney(data, (result) => checkResult.call(this, result, "Баланс пополнен"));
}

moneyManager.conversionMoneyCallback = function (data) {
    ApiConnector.convertMoney(data, (result) => checkResult.call(this, result, "Конвертация выполнена"));
}

moneyManager.sendMoneyCallback = function (data) {
    ApiConnector.transferMoney(data, (result) => checkResult.call(this, result, "Перевод отправлен"));
}

const favoritesWidget = new FavoritesWidget();

function updateFavoritesWidget(result) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(result.data);
    moneyManager.updateUsersList(result.data);
}

ApiConnector.getFavorites((result) => {if (result.success) updateFavoritesWidget(result)});

favoritesWidget.addUserCallback = function (data) {
    ApiConnector.addUserToFavorites(data, (result) => {
                                        if (result.success) {
                                            updateFavoritesWidget(result);
                                        } 
                                        this.setMessage(!result.success, result.success ? "Пользователь добавлен в избранное" : result.error);
                                    })
}

favoritesWidget.removeUserCallback = function(data) {
    ApiConnector.removeUserFromFavorites(data, (result) => {
                                        if (result.success) {
                                                updateFavoritesWidget(result);
                                            } 
                                            this.setMessage(!result.success, result.success ? "Пользователь удален из избранного" : result.error);
                                        })
}