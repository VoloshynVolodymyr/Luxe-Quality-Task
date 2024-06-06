const Page = require('./page');

class CartPage extends Page {

    get cartItem() {
        return $("//div[@class='cart_item']");
    }

    get cartItemTitle() {
        return $("(//div[@class='inventory_item_name'])[1]");
    }
    
    get cartItemPrice() {
        return $("//div[@data-test='inventory-item-price']")
    }

    get checkoutButton() {
        return $("//button[@id='checkout']");
    }

    async waitUntilRedirectedToCartPage() {
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url === 'https://www.saucedemo.com/cart.html';
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected to be redirected to cart page'
            }
        );
    }

    open() {
        return super.open('cart.html');
    }
}

module.exports = CartPage;
