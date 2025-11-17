document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("main form");
    const customerIdInput = document.getElementById("customer_id");
    const idInput = document.getElementById("id");
    const nameInput = document.getElementById("name");
    const addressInput = document.getElementById("address");
    const postalcodeInput = document.getElementById("zip");
    const cityInput = document.getElementById("city");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");

    const params = new URLSearchParams(window.location.search);
    const customerId = params.get("id");

    if (customerId) {
        fetch(`/api/customers/search?customerId=${customerId}`)
            .then(res => res.json())
            .then(customers => {
                if (customers.length === 0) {
                    alert("Customer not found");
                    return;
                }
                const customer = customers[0];
                customerIdInput.value = customer.customerID;
                idInput.value = customer.customerID;
                nameInput.value = customer.name;
                addressInput.value = customer.address;
                postalcodeInput.value = customer.postalCode;
                cityInput.value = customer.city;
                phoneInput.value = customer.phone;
                emailInput.value = customer.email;
            })
            .catch(err => {
                console.error(err);
                alert("Error loading customer data");
            });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            customer_id: customerIdInput.value,
            name: nameInput.value.trim(),
            address: addressInput.value.trim(),
            postalcode: postalcodeInput.value.trim(),
            city: cityInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim()
        };

        try {
            let response;
            if (customerId) {
                response = await fetch(`/api/customers/${customerId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
            } else {
                response = await fetch(`/api/customers`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Something went wrong");
            }

            alert(result.message);
            window.location.href = "/customers";
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    });
});
