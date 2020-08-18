"use strict";

const logOutButton = new LogoutButton();

logOutButton.action = function () {
    ApiConnector.logout((result) => {if (result.success) location.reload()});
}