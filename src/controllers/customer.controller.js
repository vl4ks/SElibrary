const manageCustomerService = require('../services/customer.service');
const { BadRequestError } = require('../errors');

class CustomerController {
    async search(req, res, next) {
        console.log('CustomerController.search called with req.query:', req.query)
        try {
            const { customerId, name } = req.query;

            const customers = await manageCustomerService.search(customerId, name);
            console.log('CustomerController.search returning', customers)
            res.json(customers);

        } catch (err) {
            console.log('CustomerController.search error:', err.message)
            next(err);
        }
    }

    async add(req, res, next) {
        console.log('CustomerController.add called with req.body:', req.body)
        try {
            const data = req.body;

            if (!data.name) throw new BadRequestError("Name is required");

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9+\-() ]{5,20}$/;

            if (data.email && !emailRegex.test(data.email))
                throw new BadRequestError("Invalid email format");

            if (data.phone && !phoneRegex.test(data.phone))
                throw new BadRequestError("Invalid phone format");

            const newCustomerId = await manageCustomerService.add(data);

            console.log('CustomerController.add successful, newCustomerId:', newCustomerId)
            res.json({
                message: "Customer created successfully",
                customerID: newCustomerId
            });

        } catch (err) {
            console.log('CustomerController.add error:', err.message)
            next(err);
        }
    }

    async edit(req, res, next) {
        console.log('CustomerController.edit called with req.body:', req.body)
        try {
            const data = req.body;

            if (!data.customerID)
                throw new BadRequestError("customer_id is required");

            if (!data.name)
                throw new BadRequestError("Name is required");

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9+\-() ]{5,20}$/;

            if (data.email && !emailRegex.test(data.email))
                throw new BadRequestError("Invalid email format");

            if (data.phone && !phoneRegex.test(data.phone))
                throw new BadRequestError("Invalid phone format");

            await manageCustomerService.edit(data);

            console.log('CustomerController.edit successful')
            res.json({ message: "Customer updated successfully" });

        } catch (err) {
            console.log('CustomerController.edit error:', err.message)
            next(err);
        }
    }

    async getById(req, res, next) {
        console.log('CustomerController.getById called with req.params:', req.params)
        try {
            const { id } = req.params;

            if (!id) throw new BadRequestError("Customer ID is required");

            const customer = await manageCustomerService.getById(id);

            if (!customer)
                throw new NotFoundError(`Customer with id ${id} not found`);

            console.log('CustomerController.getById returning', customer)
            res.json(customer);

        } catch (err) {
            console.log('CustomerController.getById error:', err.message)
            next(err);
        }
    }
}

module.exports = new CustomerController();
