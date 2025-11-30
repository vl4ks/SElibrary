document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector(".search form");
    const customerIdInput = document.getElementById("customerid");
    const customerSection = document.querySelector(".customer");
    const currentIssuesTableBody = document.querySelector(".current-issues tbody");
    const historyTableBody = document.querySelector(".history tbody");

    let currentCustomerId = null;

    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const customerId = customerIdInput.value.trim();
        if (!customerId) return alert("Введите Customer ID");

        try {
            const response = await fetch(`/api/circulation/customer/${customerId}`);
            if (!response.ok) throw new Error("Клиент не найден");

            const data = await response.json();
            currentCustomerId = customerId;

            populateCustomerInfo(data.customer || {});
            populateTable(currentIssuesTableBody, data.currentIssues);
            populateTable(historyTableBody, data.history);
        } catch (err) {
            alert(err.message);
        }
    });

    document.querySelectorAll(".bookmanage .buttons button").forEach(button => {
        button.addEventListener("click", async (e) => {
            const action = e.target.textContent.toLowerCase();
            const bookIdInput = document.getElementById("bookid");
            const bookId = bookIdInput.value.trim();

            if (!currentCustomerId) return alert("Сначала выберите клиента");
            if (!bookId) return alert("Введите Book ID");

            try {
                let url = "";
                switch(action) {
                    case "issue": url = "/api/circulation/issue"; break;
                    case "return": url = "/api/circulation/return"; break;
                    case "renew": url = "/api/circulation/renew"; break;
                    default: return;
                }

                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bookId, customerId: currentCustomerId })
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.message || "Ошибка");

                if (action === "return" && result.isOverdue) {
                    alert(result.message + " ⚠️ Книга была просрочена!");
                } else {
                    alert(result.message);
                }

                const updated = await fetch(`/api/circulation/customer/${currentCustomerId}`);
                const updatedData = await updated.json();
                populateTable(currentIssuesTableBody, updatedData.currentIssues);
                populateTable(historyTableBody, updatedData.history);
            } catch (err) {
                alert(err.message);
            }
        });
    });

    function populateTable(tbody, records) {
        tbody.innerHTML = "";
        if (!records || records.length === 0) {
            const row = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 3;
            td.textContent = "Нет записей";
            row.appendChild(td);
            tbody.appendChild(row);
            return;
        }

        records.forEach(rec => {
            const row = document.createElement("tr");

            const titleCell = document.createElement("td");
            titleCell.textContent = rec.title || rec.bookID;

            const issueCell = document.createElement("td");
            issueCell.textContent = rec.issueDate ? new Date(rec.issueDate).toLocaleDateString() : "";

            const returnCell = document.createElement("td");
            const returnDate = rec.returnDate ? new Date(rec.returnDate).toLocaleDateString() : "";
            returnCell.textContent = returnDate;

            if (rec.overdue) {
                returnCell.innerHTML += ' ⚠️';
                returnCell.classList.add("overdue");
            }

            row.appendChild(titleCell);
            row.appendChild(issueCell);
            row.appendChild(returnCell);
            tbody.appendChild(row);
        });
    }

    function populateCustomerInfo(customer) {
        customerSection.innerHTML = `
            <h1>${customer.name || "-"}<br>(${customer.customerID || "-"})</h1>
            <p>${customer.postalCode || "-"} ${customer.city || "-"}</p>
            <div class="buttons">
                <button onclick="window.location.href='/addeditcustomer?id=${customer.customerID}'">Edit...</button>
            </div>
        `;
    }
});
