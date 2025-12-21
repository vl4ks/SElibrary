document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("main form");

    const customerIdInput = document.getElementById("customer_id");
    const idInput = document.getElementById("id");
    const nameInput = document.getElementById("name");
    const addressInput = document.getElementById("address");
    const postalCodeInput = document.getElementById("zip");
    const cityInput = document.getElementById("city");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");

    const params = new URLSearchParams(window.location.search);
    const customerId = params.get("id");

    if (customerId) {

        fetch(`/api/customer/${customerId}`)
            .then(res => res.json())
            .then(customer => {
                if (!customer) {
                    alert("Customer not found");
                    return;
                }

                customerIdInput.value = customer.customerID;
                idInput.value = customer.customerID;
                idInput.disabled = true;
                nameInput.value = customer.name || "";
                addressInput.value = customer.address || "";
                postalCodeInput.value = customer.postalCode || "";
                cityInput.value = customer.city || "";
                phoneInput.value = customer.phone || "";
                emailInput.value = customer.email || "";
            })
            .catch(err => {
                console.error(err);
                alert("Error loading customer data");
            });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            customerID: customerIdInput.value,
            name: nameInput.value.trim(),
            address: addressInput.value.trim(),
            postalCode: postalCodeInput.value.trim(),
            city: cityInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim()
        };

        try {
            let response;
            if (customerId) {
                response = await fetch(`/api/customer/edit`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
            } else {
                response = await fetch(`/api/customer/add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || "Something went wrong");
            }

            alert(result.message);
            window.location.href = "/customers";
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    });
});
