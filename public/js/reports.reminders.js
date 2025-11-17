document.addEventListener('DOMContentLoaded', () => {
    const remindersTableBody = document.querySelector('#remindersSection tbody')

    fetchReminders()

    async function fetchReminders() {
        const res = await fetch('/api/report/reminders')

        const data = await res.json()

        renderReminders(data)
    }

    function renderReminders(reminders) {
        remindersTableBody.innerHTML = ''

        if (!reminders || reminders.length === 0)
            return

        reminders.forEach(reminder => {
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${reminder.title}</td>
                <td>${reminder.customerID}</td>
                <td>${reminder.issueDate}</td>
                <td>${reminder.returnDate}</td>
            `
            remindersTableBody.appendChild(row)
        })
    }
})