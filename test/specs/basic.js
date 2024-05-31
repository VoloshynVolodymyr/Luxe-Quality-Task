const { expect } = require('@wdio/globals');
const LoginPage = require('../pageobjects/login.page');
const InventoryPage = require('../pageobjects/inventory.page');

describe('SauceDemo Basic Actions', () => {
    // Перевірка, що при успішному логіні користувача переправляє на сторінку Inventory і продукти та корзина відображаються
    it('When Login is successful, user is redirected to inventory page and products are displayed', async () => {
        // Логінимося з валідними даними
        await LoginPage.open();
        await LoginPage.login('standard_user', 'secret_sauce');

        await LoginPage.waitUntilRedirectedToInventoryPage(); // Використання методу waitUntilRedirectedToInventoryPage

        // Перевірка, що поточна URL - сторінка з інвентарем
        const currentUrl = await browser.getUrl();
        expect(currentUrl).toBe('https://www.saucedemo.com/inventory.html');

        // Перевірка, що продукти відображаються
        const inventoryContainer = await $('.inventory_container');
        const isInventoryDisplayed = await inventoryContainer.isDisplayed();
        expect(isInventoryDisplayed).toBe(true);

        // Перевірка, що корзина відображається
        const shoppingCartContainer = await $('#shopping_cart_container');
        const isShoppingCartDisplayed =
            await shoppingCartContainer.isDisplayed();
        expect(isShoppingCartDisplayed).toBe(true);
    });

    // Перевірка, що користувач з обмеженими правами доступу бачить обмежений контент
    it('should allow problem_user to log in but with incorrect image links', async () => {
        await LoginPage.open();
        await LoginPage.login('problem_user', 'secret_sauce');

        await LoginPage.waitUntilRedirectedToInventoryPage(); // Використання методу waitUntilRedirectedToInventoryPage

        const currentUrl = await browser.getUrl();
        expect(currentUrl).toBe('https://www.saucedemo.com/inventory.html');

        const inventoryItems = await InventoryPage.inventoryItems;
        let allImagesSame = true;
        for (let item of inventoryItems) {
            const image = await item.$('img.inventory_item_img');
            const src = await image.getAttribute('src');
            if (src !== '/static/media/sl-404.168b1cce.jpg') {
                allImagesSame = false;
                break;
            }
        }
        expect(allImagesSame).toBe(true);
    });

    // Перевірка, що зображення на значку корзини оновлюється після додавання товару до корзини
    it('should update shopping cart icon after adding item to cart', async () => {
        await LoginPage.open();
        await LoginPage.login('standard_user', 'secret_sauce');

        await LoginPage.waitUntilRedirectedToInventoryPage(); // Використання методу waitUntilRedirectedToInventoryPage

        await InventoryPage.addToCart();

        await browser.waitUntil(
            async () => {
                const cartBadgeText = await InventoryPage.getCartBadgeText();
                return cartBadgeText === '1';
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected shopping cart badge to update to "1"',
            }
        );

        const cartBadgeText = await InventoryPage.getCartBadgeText();
        expect(cartBadgeText).toBe('1');
    });
});
