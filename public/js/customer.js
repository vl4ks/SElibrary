document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const tableBody = document.querySelector("#customersTable tbody");

    const editBtn = document.getElementById("editBtn");
    const addBtn = document.getElementById("addBtn");

    let selectedCustomerId = null;

    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("id").value.trim();
        const name = document.getElementById("name").value.trim();

        const params = new URLSearchParams();

        if (id) params.append("customerId", id);
        if (name) params.append("name", name);

        const response = await fetch(`/api/customer/search?${params.toString()}`);
        const customers = await response.json();

        tableBody.innerHTML = "";

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
    });

    function selectRow(row) {
        document.querySelectorAll("#customersTable tr").forEach(r => r.classList.remove("selected"));
        row.classList.add("selected");

        selectedCustomerId = row.dataset.id;
        editBtn.disabled = false;
    }

    editBtn.addEventListener("click", () => {
        if (selectedCustomerId)
            window.location.href = `/addeditcustomer?id=${selectedCustomerId}`;
    });

    addBtn.addEventListener("click", () => {
        window.location.href = `/addeditcustomer`;
    });
});
