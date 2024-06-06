const Random =  {
	generatePassword(length = 12) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }
        return password;
	},

    generateFirstName() {
        const firstNames = [
            'John', 'Jane', 'Michael', 'Sarah', 'Robert', 'Emily',
            'David', 'Jessica', 'James', 'Linda', 'William', 'Susan'
        ];
        return firstNames[Math.floor(Math.random() * firstNames.length)];
    },

    generateLastName() {
        const lastNames = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia',
            'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez'
        ];
        return lastNames[Math.floor(Math.random() * lastNames.length)];
    },

    generatePostalCode() {
        const postalCode = Math.floor(10000 + Math.random() * 90000).toString();
        return postalCode;
    }
};

module.exports = Random;
