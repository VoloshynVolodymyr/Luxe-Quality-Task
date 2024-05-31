const { $ } = require('@wdio/globals');
const Page = require('./page');

class InventoryPage extends Page {
    get inventoryItems() {
        return $$('.inventory_item');
    }

    async addToCart() {
        const addToCartButton = await $('#add-to-cart-sauce-labs-backpack');
        await addToCartButton.click();
    }

    async getCartBadgeText() {
        const cartBadge = await $(
            '.shopping_cart_badge[data-test="shopping-cart-badge"]'
        );
        return cartBadge.getText();
    }

    open() {
        return super.open('inventory.html');
    }
}

module.exports = new InventoryPage();
