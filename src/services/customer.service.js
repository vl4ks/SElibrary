const customerRepository = require("../repositories/customer.repository")
const Customer = require("../models/customer")

class ManageCustomerService {
    async search(customerId, name) {
        const customers = await customerRepository.findByParameters(customerId, name)
        return customers
    }
    
    async add(customerData) {
        const customer = new Customer(
            null,
            customerData.name,
            customerData.address,
            customerData.postalcode,
            customerData.city,
            customerData.phone,
            customerData.email
        )

        const newCustomerId = await customerRepository.create(customer)
        return newCustomerId
    }

    async edit(customerData) {
        const customer = new Customer(
            customerData.customer_id,
            customerData.name,
            customerData.address,
            customerData.postalcode,
            customerData.city,
            customerData.phone,
            customerData.email
        )

        await customerRepository.update(customer)
    }
}

module.exports = new ManageCustomerService()
