const Page = require('./page');

class LoginPage extends Page {
    get userNameInput() {
        return $("//input[@id='user-name']");
    }

    async setUserName(username) {
        await this.userNameInput.setValue(username);
    }

    get passwordInput() {
        return $("//input[@id='password']");
    }

    async setPassword(password) {
        await this.passwordInput.setValue(password);
    }

    get btnSubmit() {
        return $("//input[@id='login-button']");
    }

    async btnSubmitClick() {
        await this.btnSubmit.click();
    }

    get firstIcon() {
        return $("(//*[@aria-hidden='true'])[1]")
    }

    get secondIcon() {
        return $("(//*[@aria-hidden='true'])[2]")
    }

    get errorMessageField() {
        return $("//h3[@data-test='error']")
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
    
    
    open() {
        return super.open('');
    }


    async validLogin() {
        await this.setUserName('standard_user');
        await this.setPassword('secret_sauce');
        await this.btnSubmitClick();
        await this.waitUntilRedirectedToInventoryPage();
    }
}

module.exports = LoginPage;

