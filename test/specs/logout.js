const assert = require('assert');

const LoginPage = require('../pageobjects/login.page');
const InventoryPage = require('../pageobjects/inventory.page');
const CartPage = require('../pageobjects/cart.page');
const CheckSorting = require('./../../js/checkSorting');
describe('SauceDemo Logout and SavingToCart Actions', () => {
    let loginPage, inventoryPage, cartPage, checkSorting;

    before(async function () {
        await browser.setWindowSize(1280, 800);
        loginPage = new LoginPage();
        inventoryPage = new InventoryPage();
        cartPage = new CartPage();
		checkSorting = new CheckSorting();
    });

    it('Logout', async () => {
        await loginPage.open();
        await loginPage.validLogin();
        await inventoryPage.burgerClick();

        // Check menu display
        const menu = await inventoryPage.menu;
        await menu.waitForDisplayed();
        assert.strictEqual(await menu.isDisplayed(), true, 'Menu should be displayed');

        // Check menu items count
        const menuItems = await inventoryPage.menuItems;
        assert.strictEqual(menuItems.length, 4, 'There should be 4 menu items');

        await inventoryPage.logoutBtnClick();

        // User is redirected to the Login page
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url === 'https://www.saucedemo.com/';
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected to be redirected to https://www.saucedemo.com/'
            }
        );

        // Check if username and password fields are empty
        assert.strictEqual(await loginPage.userNameInput.getValue(), '', 'Username field should be empty');
        assert.strictEqual(await loginPage.passwordInput.getValue(), '', 'Password field should be empty');
    });

    it('Saving the cart after logout', async () => {
        await loginPage.open();
        await loginPage.validLogin();
        await inventoryPage.firstInventoryItemBtn.click();

        // Check cart badge value
        const badgeValue = await inventoryPage.getShoppingCartValue();
        assert.strictEqual(badgeValue, '1', 'Value should be 1');

        await inventoryPage.shoppingCart.click();

        // Check if cart item is displayed
        const isCartItemDisplayed = await cartPage.cartItem.isDisplayed();
        assert.strictEqual(isCartItemDisplayed, true, 'Cart item must be displayed');

        await inventoryPage.burgerClick();

        // Check menu display
        const menu = await inventoryPage.menu;
        await menu.waitForDisplayed();
        assert.strictEqual(await menu.isDisplayed(), true, 'Menu should be displayed');

        // Check menu items count
        const menuItems = await inventoryPage.menuItems;
        assert.strictEqual(menuItems.length, 4, 'There should be 4 menu items');

        await inventoryPage.logoutBtnClick();

        // User is redirected to the Login page
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url === 'https://www.saucedemo.com/';
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected to be redirected to https://www.saucedemo.com/'
            }
        );

        // Check if username and password fields are empty
        assert.strictEqual(await loginPage.userNameInput.getValue(), '', 'Username field should be empty');
        assert.strictEqual(await loginPage.passwordInput.getValue(), '', 'Password field should be empty');

        // Login again and check redirection to the inventory page
        await loginPage.validLogin();
        await inventoryPage.waitUntilRedirectedToInventoryPage();

        // Check products and cart display on the inventory page
        assert.strictEqual(await inventoryPage.firstInventoryItem.isDisplayed(), true, 'Products should be displayed');
        assert.strictEqual(await inventoryPage.shoppingCart.isDisplayed(), true, 'Cart should be displayed');

        const shoppingItemTitle = await inventoryPage.firstInventoryItemTitle.getText();
        await inventoryPage.shoppingCart.click();

        // Check redirection to the cart page and product title match
        await cartPage.waitUntilRedirectedToCartPage();
        const cartItemTitle = await cartPage.cartItemTitle.getText();
        assert.strictEqual(shoppingItemTitle, cartItemTitle, 'Product must be the same as was added on the Inventory page');
    });
});
