const assert = require('assert');
const Random = require('../../js/random');

const LoginPage = require('../pageobjects/login.page');
const InventoryPage = require('../pageobjects/inventory.page');
const CartPage = require('../pageobjects/cart.page');
const CheckoutPage = require('../pageobjects/checkout.page');

describe('SauceDemo Checkout Actions', () => {
    let loginPage, inventoryPage, cartPage, checkoutPage;

    before(async function () {
        await browser.setWindowSize(1280, 800);
        loginPage = new LoginPage();
        inventoryPage = new InventoryPage();
        cartPage = new CartPage();
        checkoutPage = new CheckoutPage();
    });

    it('Valid Checkout', async () => {
        await loginPage.open();
        await loginPage.setUserName('standard_user');
        await loginPage.setPassword('secret_sauce');
        await loginPage.btnSubmitClick();

        //Click on the "Add to cart" button near any product
        await inventoryPage.firstInventoryItemBtn.click();
        //Check that near the cart at the top right increase by 1
        const badgeValue = await inventoryPage.getShoppingCartValue();
        assert.strictEqual(badgeValue, '1', 'Value should be 1');

        //Click on the "Cart" button at the top right cornet
        await inventoryPage.shoppingCart.click();

        //Cart page is displayed
        await cartPage.waitUntilRedirectedToCartPage();

        //Product is the same as was one added at step 1
        let cartItem = await cartPage.cartItem.waitForDisplayed();
        const isCartItemDisplayed = await cartPage.cartItem.isDisplayed();
        assert.strictEqual(
            isCartItemDisplayed,
            true,
            'Cart item must be displayed'
        );

        await cartPage.checkoutButton.click();
        await checkoutPage.waitUntilRedirectedToCheckoutStepOnePage();
        //Checkout Form is displayed
        const isCheckoutFormDisplayed =
            await checkoutPage.checkoutForm.isDisplayed();
        assert.strictEqual(
            isCheckoutFormDisplayed,
            true,
            'Checkout form must be displayed'
        );

        //Fill the "First Name" field with valid data
        const firstName = Random.generateFirstName();
        await checkoutPage.setFirstNameInput(firstName);
        //Fill the "Second Name" field with valid data
        const lastName = Random.generateLastName();
        await checkoutPage.setLastNameInput(lastName);
        //Fill the "Postal Code" field with valid data
        const postalCode = Random.generatePostalCode();
        await checkoutPage.setPostalCodeInput(postalCode);

        const firstNameValue = await checkoutPage.firstNameInput.getValue();
        const lastNameValue = await checkoutPage.lastNameInput.getValue();
        const postalCodeValue = await checkoutPage.postalCodeInput.getValue();

        // Check that data is entered to the field
        assert.notStrictEqual(
            firstNameValue,
            '',
            '"First Name" Field should not be empty'
        );
        assert.notStrictEqual(
            lastNameValue,
            '',
            '"Last Name" Field should not be empty'
        );
        assert.notStrictEqual(
            postalCodeValue,
            '',
            '"Postal Code" Field should not be empty'
        );

        // Verify the field values match the generated values
        assert.strictEqual(
            firstNameValue,
            firstName,
            '"First Name" Field should match'
        );
        assert.strictEqual(
            lastNameValue,
            lastName,
            '"Last Name" Field should match'
        );
        assert.strictEqual(
            postalCodeValue,
            postalCode,
            '"Postal Code" Field should match'
        );

        //Click on the "Continue" button
        await checkoutPage.submitBtn.click();

        // Wait until redirected to checkout step two page
        await checkoutPage.waitUntilRedirectedToCheckoutStepTwoPage();

        // Assert that user is redirected to the "Overview" page
        const overviewUrl = await browser.getUrl();
        assert.strictEqual(
            overviewUrl.includes('checkout-step-two.html'),
            true,
            'User should be redirected to the "Overview" page'
        );

        // Assert that the products from step 1 are displayed on the overview page
        const overviewCartItem = await cartPage.cartItem.isDisplayed();
        assert.strictEqual(
            overviewCartItem,
            true,
            'Product from step 1 should be displayed on the "Overview" page'
        );

        //Product price on the Inventory page is equal to the product price on the summary page
        const productPriceText = await cartPage.cartItemPrice.getText();
        const productPrice = parseFloat(productPriceText.replace('$', ''));

        const totalPriceText = await checkoutPage.totalPrice.getText();
        const totalPrice = parseFloat(totalPriceText.replace('Total: $', ''));

        const taxPriceText = await checkoutPage.taxPrice.getText();
        const taxPrice = parseFloat(taxPriceText.replace('Tax: $', ''));
        const checkoutItemPrice = (totalPrice - taxPrice).toFixed(2);
        const inventoryItemPrice = productPrice.toFixed(2);
        console.log(
            'Price : ',
            (totalPrice - taxPrice).toFixed(2),
            ' ',
            productPrice.toFixed(2)
        );
        assert.strictEqual(
            checkoutItemPrice,
            inventoryItemPrice,
            'Item price on inventory page should be equal to the item price on summary page'
        );

        //Click on the "Finish" button
        await checkoutPage.finishBtn.click();

        // Wait until redirected to checkout complete page
        await checkoutPage.waitUntilRedirectedToCheckoutCompletePage();

        // Verify the message "Thank you for your order" is displayed
        const completeTextHeader =
            await checkoutPage.completeTextHeader.getText();
        assert.strictEqual(
            completeTextHeader,
            'Thank you for your order!',
            'Thank you message should be displayed'
        );

        await checkoutPage.backHomeBtn.click();

        // Wait until redirected to the inventory page
        await inventoryPage.waitUntilRedirectedToInventoryPage();

        // Verify the user is redirected to the inventory page
        const inventoryUrl = await browser.getUrl();
        assert.strictEqual(
            inventoryUrl.includes('inventory.html'),
            true,
            'User should be redirected to the inventory page'
        );

        // Verify the products are displayed on the inventory page
        const isProductDisplayed =
            await inventoryPage.firstInventoryItem.isDisplayed();
        assert.strictEqual(
            isProductDisplayed,
            true,
            'Products should be displayed'
        );

        // Verify the cart is empty
        const isCartEmpty = await inventoryPage.shoppingCart.getText();
        assert.strictEqual(isCartEmpty, '', 'Cart should be empty');
    });

    it('Checkout without product', async () => {
        await loginPage.open();
        await loginPage.validLogin();
        await inventoryPage.shoppingCart.click();

        //Cart page is displayed
        await cartPage.waitUntilRedirectedToCartPage();

        // Verify products are not displayed
        const isCartEmpty = await cartPage.cartItem.isDisplayed();
        assert.strictEqual(isCartEmpty, false, 'Cart should be empty');

        // Click on the "Checkout" button
        await cartPage.checkoutButton.click();

        await browser.pause(3000);
        // Verify user is still on the "Cart" page
        const cartUrl = await browser.getUrl();
        assert.strictEqual(
            cartUrl.includes('cart.html'),
            true,
            'User should still be on the "Cart" page'
        );
    });
});
