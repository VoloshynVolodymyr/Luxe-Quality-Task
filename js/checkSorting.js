class CheckSorting {
    static checkDescendingOrderByPrice(prices) {
        let isDescending = true;
        for (let i = 0; i < prices.length - 1; i++) {
            if (+prices[i] < +prices[i + 1]) {
                isDescending = false;
                break;
            }
        }
        return isDescending;
    }

    static checkAscendingOrderByPrice(prices) {
        let isAscending = true;
        for (let i = 0; i < prices.length - 1; i++) {
            if (+prices[i] > +prices[i + 1]) {
                isAscending = false;
                break;
            }
        }
        return isAscending;
    }

	static checkAscendingOrderByTitle(titles) {
        for (let i = 0; i < titles.length - 1; i++) {
            if (titles[i].localeCompare(titles[i + 1]) > 0) {
                return false;
            }
        }
        return true;
    }

    static checkDescendingOrderByTitle(titles) {
        for (let i = 0; i < titles.length - 1; i++) {
            if (titles[i].localeCompare(titles[i + 1]) < 0) {
                return false;
            }
        }
        return true;
    }
}

module.exports = CheckSorting;