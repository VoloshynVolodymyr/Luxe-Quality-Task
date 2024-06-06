const Page = require('./page');

class CheckoutPage extends Page {
    get checkoutForm() { 
		return $("//div[@class='checkout_info']"); 
	}

    get firstNameInput() {
        return $("//input[@id='first-name']");
    }

    get lastNameInput() {
        return $("//input[@id='last-name']");
    }

    get postalCodeInput() {
        return $("//input[@id='postal-code']");
    }

    get submitBtn() {
        return $("//input[@type='submit']");
    }

    get taxPrice() {
        return $("//div[@class='summary_tax_label']");
    }

    get totalPrice() {
        return $("//div[@class='summary_total_label']");
    }

    get finishBtn() {
        return $("//button[@id='finish']");
    }
    
    get completeTextHeader() {
        return $('//h2[@data-test="complete-header"]');
    }

    get backHomeBtn() {
        return $("//button[@id='back-to-products']")
    }

    async setFirstNameInput(value) {
        await this.firstNameInput.setValue(value);
    }

    async setLastNameInput(value) {
        await this.lastNameInput.setValue(value);
    }

    async setPostalCodeInput(value) {
        await this.postalCodeInput.setValue(value);
    }

    async waitUntilRedirectedToCheckoutStepOnePage() {
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('checkout-step-one.html');
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected to be redirected to checkout step one page'
            }
        );
    }

    async waitUntilRedirectedToCheckoutStepTwoPage() {
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('checkout-step-two.html');
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected to be redirected to checkout step two page'
            }
        );
    }

    async waitUntilRedirectedToCheckoutCompletePage() {
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('checkout-complete.html');
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected to be redirected to checkout complete page'
            }
        );
    }
}

module.exports = CheckoutPage;
