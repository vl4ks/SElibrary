const customerRepository = require("../repositories/customer.repository");
const Customer = require("../models/customer");

class ManageCustomerService {

    async search(customerId, name) {
        console.log('ManageCustomerService.search called with', { customerId, name })
        const customers = await customerRepository.findByParameters(customerId, name);
        console.log('ManageCustomerService.search returning', customers)
        return customers;
    }

    async getById(id) {
        console.log('ManageCustomerService.getById called with id:', id)
        const customer = await customerRepository.findById(id);
        console.log('ManageCustomerService.getById returning', customer)
        return customer;
    }

    async add(customerData) {
        console.log('ManageCustomerService.add called with', customerData)
        const customer = new Customer(
            null,
            customerData.name,
            customerData.address,
            customerData.postalCode,
            customerData.city,
            customerData.phone,
            customerData.email
        );

        const newCustomerId = await customerRepository.create(customer);
        console.log('ManageCustomerService.add returning newCustomerId:', newCustomerId)
        return newCustomerId;
    }

    async edit(customerData) {
        console.log('ManageCustomerService.edit called with', customerData)
        const customer = new Customer(
            customerData.customerID,
            customerData.name,
            customerData.address,
            customerData.postalCode,
            customerData.city,
            customerData.phone,
            customerData.email
        );

        await customerRepository.update(customer);
        console.log('ManageCustomerService.edit completed successfully')
    }
}

module.exports = new ManageCustomerService();
