const assert = require('assert');

const LoginPage = require('../pageobjects/login.page');
const InventoryPage = require('../pageobjects/inventory.page');

describe('SauceDemo Social Actions', () => {
    let loginPage, inventoryPage;
    let socialLinks = [];

    before(async function() {
        await browser.setWindowSize(1280, 800);
        loginPage = new LoginPage();
        inventoryPage = new InventoryPage();
    });

    it('Footer Links', async () => {
        await loginPage.open();
        await loginPage.validLogin();

        // Collect social links
        socialLinks = [
            { name: 'X', link: await inventoryPage.twitterLink },
            { name: 'Facebook', link: await inventoryPage.facebookLink },
            { name: 'LinkedIn', link: await inventoryPage.linkedinLink }
        ];

        // Loop through each social link
        for (const social of socialLinks) {
            await social.link.click();
            await inventoryPage.waitUntilNewTabOpens();
            await inventoryPage.switchToNewTab();
            const url = await browser.getUrl();
            // Assert that the URL contains the expected domain for the social network
            assert.strictEqual(url.includes(`${social.name.toLowerCase()}.com`), true, `${social.name} page should be opened`);
            await browser.closeWindow();
            const handles = await browser.getWindowHandles();
            await browser.switchToWindow(handles[0]);
        }
    });
});
