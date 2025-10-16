const customerRepository = require("../repositories/customer.repository")

class ManageCustomerService {
    async search(customerId, name) { // call on start without parameters in controller
        // customerRepository.findByParameters(customerId, name)
        // return customers[]
    }
    
    async add(customer) {
        // customerRepository.create()
    }

    async edit(customer) {
        // customerRepository.update()
    }
}