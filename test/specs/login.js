const assert = require('assert');
const Random = require('../../js/random');

const LoginPage = require('../pageobjects/login.page');
const InventoryPage = require('../pageobjects/inventory.page');

describe('SauceDemo Login Actions', () => {
    let loginPage, inventoryPage;

    before(async function() {
        await browser.setWindowSize(1280, 800);
        loginPage = new LoginPage();
        inventoryPage = new InventoryPage();
    });

    it('Valid Login', async () => {
        await loginPage.open();
        await loginPage.setUserName('standard_user');
        await loginPage.setPassword('secret_sauce');
        // Data is entered into the field
        assert.equal(await loginPage.userNameInput.getValue(), 'standard_user');
        // Data is represented as dots instead of characters
        assert.equal(await loginPage.passwordInput.getAttribute("type"), 'password');

        await loginPage.btnSubmitClick();

        // Waiting until redirected to the inventory page
        await inventoryPage.waitUntilRedirectedToInventoryPage();
        
        // User is redirected to the inventory page
        const currentUrl = await browser.getUrl();
        expect(currentUrl).toBe('https://www.saucedemo.com/inventory.html');

        // Products and cart are displayed on the inventory page
        assert.equal(await inventoryPage.firstInventoryItem.isDisplayed(), true);
        assert.equal(await inventoryPage.shoppingCart.isDisplayed(), true);
    });

    it('Login with invalid password', async () => {
        const password = Random.generatePassword();
        await loginPage.open();
        await loginPage.setUserName('standard_user');
        await loginPage.setPassword(password);
        // Data is entered into the field
        assert.equal(await loginPage.userNameInput.getValue(), 'standard_user');
        // Data is represented as dots instead of characters
        assert.equal(await loginPage.passwordInput.getAttribute("type"), 'password');

        await loginPage.btnSubmitClick();

        // "X" icons are displayed on the "Login" and "Password" fields
        assert.equal(await loginPage.firstIcon.isDisplayed(), true);
        assert.equal(await loginPage.secondIcon.isDisplayed(), true);

        // "Epic sadface: Username and password do not match any user in this service" error message is displayed
        assert.equal(await loginPage.errorMessageField.getText(), "Epic sadface: Username and password do not match any user in this service");
    });

    it('Login with invalid login', async () => {
        await loginPage.open();
        await loginPage.setUserName('standarD_user');
        await loginPage.setPassword('secret_sauce');
        // Data is entered into the field
        assert.equal(await loginPage.userNameInput.getValue(), 'standarD_user');
        // Data is represented as dots instead of characters
        assert.equal(await loginPage.passwordInput.getAttribute("type"), 'password');

        await loginPage.btnSubmitClick();

        // "X" icons are displayed on the "Login" and "Password" fields
        assert.equal(await loginPage.firstIcon.isDisplayed(), true);
        assert.equal(await loginPage.secondIcon.isDisplayed(), true);

        // "Epic sadface: Username and password do not match any user in this service" error message is displayed
        assert.equal(await loginPage.errorMessageField.getText(), "Epic sadface: Username and password do not match any user in this service");
    });
});
