const assert = require('assert');

const LoginPage = require('../pageobjects/login.page');
const InventoryPage = require('../pageobjects/inventory.page');
const CheckSorting = require('./../../js/checkSorting');
describe('SauceDemo Sorting Actions', () => {
    let loginPage, inventoryPage, checkSorting;

    before(async function () {
        await browser.setWindowSize(1280, 800);
        loginPage = new LoginPage();
        inventoryPage = new InventoryPage();
        checkSorting = new CheckSorting();
    });
    it('Sorting', async () => {
        await loginPage.open();
        await loginPage.validLogin();

        //Check sorting Low-High Order
        await inventoryPage.selectFilter.click();
        await inventoryPage.optionLoHi.click();
        let prices = await inventoryPage.getInventoryPrices();
        let isAscending = CheckSorting.checkAscendingOrderByPrice(prices);
        expect(isAscending).toBe(true);

        //Check sorting High-Low Order
        await inventoryPage.selectFilter.click();
        await inventoryPage.optionHiLo.click();
        prices = await inventoryPage.getInventoryPrices();
        let isDescending = CheckSorting.checkDescendingOrderByPrice(prices);
        expect(isDescending).toBe(true);

        //Check sorting Name[A-Z]
        await inventoryPage.selectFilter.click();
        await inventoryPage.optionAZ.click();
        let titles = await inventoryPage.getInventoryItemNames();
        isAscending = CheckSorting.checkAscendingOrderByTitle(titles);
        expect(isAscending).toBe(true);
        console.log('Titles', titles);

        //Check sorting Name[A-Z]
        await inventoryPage.selectFilter.click();
        await inventoryPage.optionZA.click();
        titles = await inventoryPage.getInventoryItemNames();
        isDescending = CheckSorting.checkDescendingOrderByTitle(titles);
        expect(isDescending).toBe(true);
        console.log('Titles', titles);
    });
});
