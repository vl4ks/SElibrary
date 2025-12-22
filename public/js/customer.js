document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const tableBody = document.querySelector("#customersTable tbody");

    const editBtn = document.getElementById("editBtn");
    const addBtn = document.getElementById("addBtn");

    let selectedCustomerId = null;

    editBtn.disabled = true;

    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("id").value.trim();
        const name = document.getElementById("name").value.trim();

        const params = new URLSearchParams();
        if (id) params.append("customerId", id);
        if (name) params.append("name", name);

        try {
            const response = await fetch(`/api/customer/search?${params.toString()}`);

            if (!response.ok) {
                throw new Error("Error trying to find clients");
            }

            const customers = await response.json();

            tableBody.innerHTML = "";
            selectedCustomerId = null;
            editBtn.disabled = true;

            if (id && customers.length === 0) {
                alert(`Customer with ID ${id} not found`);
                return;
            }

            if (customers.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5">Нет записей</td></tr>`;
                return;
            }

            customers.forEach(c => {
                const tr = document.createElement("tr");
                tr.dataset.id = c.customerID;

                tr.innerHTML = `
                    <td>${c.customerID}</td>
                    <td>${c.name}</td>
                    <td>${c.address || ""}</td>
                    <td>${c.postalCode || ""}</td>
                    <td>${c.city || ""}</td>
                `;

                tr.addEventListener("click", () => selectRow(tr));
                tableBody.appendChild(tr);
            });

        } catch (err) {
            alert(err.message);
            tableBody.innerHTML = "";
            editBtn.disabled = true;
            selectedCustomerId = null;
        }
    });

    function selectRow(row) {
        document
            .querySelectorAll("#customersTable tbody tr")
            .forEach(r => r.classList.remove("selected"));

        row.classList.add("selected");
        selectedCustomerId = row.dataset.id;
        editBtn.disabled = false;
    }

    editBtn.addEventListener("click", () => {
        if (!selectedCustomerId) return;
        window.location.href = `/addeditcustomer?id=${selectedCustomerId}`;
    });

    addBtn.addEventListener("click", () => {
        window.location.href = `/addeditcustomer`;
    });
});
