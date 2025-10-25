document.addEventListener('DOMContentLoaded', () => {
    const remindersTableBody = document.querySelector('#remindersSection tbody')

    fetchReminders()

    async function fetchReminders() {
        const res = await fetch('/api/report/reminders')

        if (!res.ok) {
            alert('Failed to fetch reminders')
            return
        }

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
                <td>${reminder.customer_id}</td>
                <td>${reminder.issue_date}</td>
                <td>${reminder.return_date}</td>
            `
            remindersTableBody.appendChild(row)
        })
    }
})