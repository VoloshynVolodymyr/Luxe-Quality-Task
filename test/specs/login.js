const { expect } = require('@wdio/globals');
const LoginPage = require('../pageobjects/login.page');
const InventoryPage = require('../pageobjects/inventory.page');

describe('SauceDemo Login', () => {
    beforeEach(async () => {
        await LoginPage.open(); // Відкриття сторінки перед кожним тестом
    });

    // Перевірка відображення поля для введення пароля з типом "password"
    it("should display password input as type 'password'", async () => {
        const passwordInput = await LoginPage.inputPassword;
        expect(await passwordInput.getAttribute('type')).toBe('password');
    });

    // Перевірка можливості входу користувача standard_user
    it('should allow standard_user to log in', async () => {
        // Перевірка, що поле Username заповнене і містить дані 'standard_user'
        const userInput = await LoginPage.inputUsername;
        await userInput.setValue('standard_user');
        expect(await userInput.getValue()).toBe('standard_user');

        // Логінуємо користувача з валідним іменем і паролем
        await LoginPage.login('standard_user', 'secret_sauce');

        await LoginPage.waitUntilRedirectedToInventoryPage(); // Очікування перенаправлення на сторінку інвентаризації

        const currentUrl = await browser.getUrl();
        expect(currentUrl).toBe('https://www.saucedemo.com/inventory.html');
    });

    // Перевірка заборони входу заблокованого користувача
    it('should not allow locked_out_user to log in', async () => {
        // Логінуємося під заблокованим користувачем
        await LoginPage.login('locked_out_user', 'secret_sauce');

        // Отримуємо текст помилки з елемента
        const errorMessage = await $('h3[data-test="error"]');
        // Очікуємо відповідь від браузера
        await browser.waitUntil(
            async () => {
                return (
                    (await errorMessage.getText()) ===
                    'Epic sadface: Sorry, this user has been locked out.'
                );
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected error message to be displayed',
            }
        );

        const errorText = await errorMessage.getText();
        expect(errorText).toBe(
            'Epic sadface: Sorry, this user has been locked out.'
        );

        // Перевіряємо, що користувач не перенаправлений на сторінку інвентаризації
        const currentUrl = await browser.getUrl();
        expect(currentUrl).not.toBe('https://www.saucedemo.com/inventory.html');
    });

    // Перевірка невдалого входу користувача з валідним іменем і невірним паролем
    it('should not allow standard_user to log in with incorrect password', async () => {
        // Вводимо невірний пароль
        await LoginPage.login('standard_user', 'non_secret_sauce');

        // Отримуємо текст помилки
        const errorMessage = await $('h3[data-test="error"]');
        await browser.waitUntil(
            async () => {
                return (
                    (await errorMessage.getText()) ===
                    'Epic sadface: Username and password do not match any user in this service'
                );
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected error message to be displayed',
            }
        );

        const errorText = await errorMessage.getText();
        expect(errorText).toBe(
            'Epic sadface: Username and password do not match any user in this service'
        );

        // Перевіряємо, що користувач не перенаправлений на сторінку інвентаризації
        const currentUrl = await browser.getUrl();
        expect(currentUrl).not.toBe('https://www.saucedemo.com/inventory.html');
    });

    //Перевірка, що користувач з обмеженими правами доступу бачить обмежений контент
    it('should allow problem_user to log in but with incorrect image links', async () => {
        await LoginPage.login('problem_user', 'secret_sauce');
        await LoginPage.waitUntilRedirectedToInventoryPage();

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
});
