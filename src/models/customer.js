class Customer {
    constructor(customer_id, name, address, postalcode, city, phone, email) {
        this.customer_id = customer_id;
        this.name = name;
        this.address = address;
        this.postalcode = postalcode;
        this.city = city;
        this.phone = phone;
        this.email = email;
    }
}

module.exports = Customer