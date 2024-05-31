const Page = require('./page');

class LoginPage extends Page {
    get inputUsername() {
        return $('#user-name');
    }

    get inputPassword() {
        return $('#password');
    }

    get btnSubmit() {
        return $('#login-button');
    }

    async waitUntilRedirectedToInventoryPage() {
        await browser.waitUntil(
            async () => {
                return (
                    (await browser.getUrl()) ===
                    'https://www.saucedemo.com/inventory.html'
                );
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected to be redirected to inventory page',
            }
        );
    }

    async login(username, password) {
        await (await this.inputUsername).waitForExist({ timeout: 5000 });
        await this.inputUsername.setValue(username);

        await (await this.inputPassword).waitForExist({ timeout: 5000 });
        await this.inputPassword.setValue(password);

        await (await this.btnSubmit).waitForExist({ timeout: 5000 });
        await this.btnSubmit.click();
    }

    open() {
        return super.open('');
    }
}

module.exports = new LoginPage();
