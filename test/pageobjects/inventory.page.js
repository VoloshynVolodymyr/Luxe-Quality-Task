const Page = require('./page');

class InventoryPage extends Page {

    get firstInventoryItem() {
        return $("(//div[@class='inventory_item'])[1]");
    }

    get firstInventoryItemTitle() {
        return $("(//div[@class='inventory_item_name '])[1]");
    }

    get firstInventoryItemBtn() {
        return $("//button[@id='add-to-cart-sauce-labs-backpack']");
    }

    get shoppingCart() {
        return $("//a[@class='shopping_cart_link']");
    }

    async getShoppingCartValue() {
        const badge = $("//span[@class='shopping_cart_badge']");
        return await badge.getText();
    }

    get burger() {
        return $("//div[@class='bm-burger-button']");
    }

    async burgerClick() {
        await this.burger.waitForDisplayed();
        await this.burger.click();
    }

    get menu() {
        return $("//div[@class='bm-menu-wrap']");
    }

    get menuItems() {
        return $$(".bm-item.menu-item");
    }

    get selectFilter() {
        return $("//select[@class='product_sort_container']");
    }

    get optionLoHi() {
        return $("//option[@value='lohi']");
    }

    get optionHiLo() {
        return $("//option[@value='hilo']");
    }

    get optionAZ() {
        return $("//option[@value='az']");
    }

    get optionZA() {
        return $("//option[@value='za']");
    }

    get logoutBtn() {
        return $("//a[contains(text(), 'Logout')]");
    }

    get twitterLink() {
        return $("//a[@data-test='social-twitter']");
    }

    get facebookLink() {
        return $("//a[@data-test='social-facebook']");
    }

    get linkedinLink() {
        return $("//a[@data-test='social-linkedin']");
    }

    async logoutBtnClick() {
        await this.logoutBtn.click();
    }

    async waitUntilRedirectedToInventoryPage() {
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url === 'https://www.saucedemo.com/inventory.html';
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected to be redirected to inventory page'
            }
        );
    }

    async waitUntilNewTabOpens() {
        await browser.waitUntil(
            async () => {
                const handles = await browser.getWindowHandles();
                return handles.length > 1;
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected a new tab to open'
            }
        );
    }

    async switchToNewTab() {
        const handles = await browser.getWindowHandles();
        await browser.switchToWindow(handles[1]);
    }

    async getInventoryPrices() {
        const prices = [];
        const elements = await $$('.inventory_item_price');
        for (const element of elements) {
            prices.push(await element.getText());
        }
        return prices;
    }

    async getInventoryItemNames() {
        const itemNames = [];
        const elements = await $$('.inventory_item_name');
        for (const element of elements) {
            itemNames.push(await element.getText());
        }
        return itemNames;
    }

    open() {
        return super.open('inventory.html');
    }
}

module.exports = InventoryPage;
