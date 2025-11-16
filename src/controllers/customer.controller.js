const manageCustomerService = require('../services/customer.service');
const { BadRequestError } = require('../errors');

class CustomerController {
    async search(req, res, next) {
        try {
            const { customerId, name } = req.query;

            const customers = await manageCustomerService.search(customerId, name);
            res.json(customers);

        } catch (err) {
            next(err);
        }
    }

    async add(req, res, next) {
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

            res.json({
                message: "Customer created successfully",
                customer_id: newCustomerId
            });

        } catch (err) {
            next(err);
        }
    }

    async edit(req, res, next) {
        try {
            const data = req.body;

            if (!data.customer_id)
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

            res.json({ message: "Customer updated successfully" });

        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CustomerController();
