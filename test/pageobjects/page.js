const { browser } = require('@wdio/globals');

module.exports = class Page {
    async open(path) {
        await browser.url(`https://www.saucedemo.com/${path}`);
    }
};
