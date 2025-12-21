document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector(".search form");
    const customerIdInput = document.getElementById("customerid");
    const customerSection = document.querySelector(".customer");
    const currentIssuesTableBody = document.querySelector(".current-issues tbody");
    const historyTableBody = document.querySelector(".history tbody");

    const bookIdInput = document.getElementById("bookid");
    const titleParagraph = document.querySelector(".bookmanage form div p");

    const issueButton = document.querySelector(".issue-return .buttons button:first-child");
    const renewButton = document.querySelector(".bookmanage.renew button");

    let currentCustomerId = null;
    let selectedRow = null;

    issueButton.disabled = true;

    currentIssuesTableBody.addEventListener("click", (e) => {
        const tr = e.target.closest("tr");
        if (!tr || tr.querySelector("td[colspan]")) return;

        if (selectedRow) selectedRow.classList.remove("selected");
        selectedRow = tr;
        selectedRow.classList.add("selected");

        bookIdInput.value = tr.dataset.bookid;
    });

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
            populateTable(historyTableBody, data.history, true);

            issueButton.disabled = false;

        } catch (err) {
            alert(err.message);
            currentCustomerId = null;
            issueButton.disabled = true;
        }
    });

    bookIdInput.addEventListener("input", async () => {
        const bookId = bookIdInput.value.trim();
        if (!bookId) {
            titleParagraph.textContent = "Title: -";
            return;
        }

        try {
            const response = await fetch(`/api/circulation/book/${bookId}`);
            const data = await response.json();

            titleParagraph.textContent = response.ok && data.title ? 
                `Title: ${data.title}` : "Title: -";

        } catch {
            titleParagraph.textContent = "Title: -";
        }
    });

    document.querySelectorAll(".bookmanage .buttons button").forEach(button => {
        button.addEventListener("click", async (e) => {
            const action = e.target.textContent.toLowerCase();
            let bookId = bookIdInput.value.trim();

            if (!currentCustomerId) return;

            if (action !== "renew" && !bookId) {
                alert("Введите Book ID");
                return;
            }

            if (action === "renew" && !selectedRow) {
                alert("Выберите строку для продления");
                return;
            }

            try {
                const url = `/api/circulation/${action}`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bookId, customerId: currentCustomerId })
                });

                const result = await response.json();
                if (!response.ok) {
                    alert(result.message || "Ошибка");
                    return;
                }

                alert(result.message);

                const updated = await fetch(`/api/circulation/customer/${currentCustomerId}`);
                const updatedData = await updated.json();

                populateTable(currentIssuesTableBody, updatedData.currentIssues);
                populateTable(historyTableBody, updatedData.history, true);

                selectedRow = null;
                bookIdInput.value = "";

            } catch (err) {
                alert(err.message);
            }
        });
    });

    function populateTable(tbody, records, isHistory = false) {
        tbody.innerHTML = "";
        if (!records || records.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3">Нет записей</td></tr>`;
            return;
        }

        const today = new Date();

        records.forEach(rec => {
            let isOverdue = false;

            if (isHistory) {
                if (rec.returnDate && rec.issueDate) {
                    const issued = new Date(rec.issueDate);
                    const returned = new Date(rec.returnDate);
                    const due = new Date(issued);
                    due.setDate(due.getDate() + 21);
                    isOverdue = returned > due;
                }
            } else {
                if (rec.returnDate) {
                    isOverdue = new Date(rec.returnDate) < today;
                }
            }

            const row = document.createElement("tr");
            row.dataset.bookid = rec.bookID;

            row.innerHTML = `
                <td>${rec.title || rec.bookID}</td>
                <td>${rec.issueDate || ""}</td>
                <td>
                    ${rec.returnDate || ""}
                    ${isOverdue ? '<img src="/img/warning-symbol.png" alt="Overdue" class="overdue-icon">' : ''}
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function populateCustomerInfo(customer) {
        customerSection.innerHTML = `
            <h1>${customer.name || "-"}<br>(${customer.customerID || "-"})</h1>
            <p>${customer.postalCode || "-"} ${customer.city || "-"}</p>
            <div class="buttons">
                <button onclick="window.location.href='/addeditcustomer?id=${customer.customerID}'">
                    Edit...
                </button>
            </div>
        `;
    }
});
