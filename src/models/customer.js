class Customer {
    constructor(customerID, name, address, postalCode, city, phone, email) {
        this.customerID = customerID;
        this.name = name;
        this.address = address;
        this.postalCode = postalCode;
        this.city = city;
        this.phone = phone;
        this.email = email;
    }
}

module.exports = Customer