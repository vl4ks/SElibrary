
document.addEventListener('DOMContentLoaded', () => {
    const remindersTableBody = document.querySelector('#remindersSection tbody')
    const headers = document.querySelectorAll('#remindersSection th')
    let remindersData = []
    let currentSort = { column: null, direction: 'asc' }

    fetchReminders()

    async function fetchReminders() {
        const res = await fetch('/api/report/reminders')

        const data = await res.json()

        remindersData = data
        renderReminders(remindersData)
    }

    const sortableHeaders = [headers[2], headers[3]]
    const sortableColumns = ['issueDate', 'returnDate']

    sortableHeaders.forEach((header, index) => {
        header.style.cursor = 'pointer'
        header.addEventListener('click', () => {
            const column = sortableColumns[index]

            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc'
            } else {
                currentSort.column = column
                currentSort.direction = 'asc'
            }

            updateHeaderIcons()
            sortReminders()
            renderReminders(remindersData)
        })
    })

    function parseDate(dateStr) {
        if (!dateStr) return null
        const parts = dateStr.split('.')
        if (parts.length !== 3) return null
        const day = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10) - 1 // months are 0-based
        const year = parseInt(parts[2], 10)
        return new Date(year, month, day)
    }

    function updateHeaderIcons() {
        headers.forEach((header, index) => {
            const columns = ['title', 'customerName', 'issueDate', 'returnDate']
            const column = columns[index]
            const baseText = header.textContent.replace(/[▲▼]/g, '').trim()
            if (currentSort.column === column) {
                const icon = currentSort.direction === 'asc' ? ' ▲' : ' ▼'
                header.textContent = baseText + icon
            } else {
                header.textContent = baseText
            }
        })
    }

    function sortReminders() {
        remindersData.sort((a, b) => {
            let aVal = a[currentSort.column]
            let bVal = b[currentSort.column]

            // Handle null/undefined values
            if (aVal == null && bVal == null) return 0
            if (aVal == null) return currentSort.direction === 'asc' ? -1 : 1
            if (bVal == null) return currentSort.direction === 'asc' ? 1 : -1

            if (currentSort.column === 'issueDate' || currentSort.column === 'returnDate') {
                aVal = parseDate(aVal)
                bVal = parseDate(bVal)
            } else {
                // Case insensitive string comparison
                aVal = String(aVal).toLowerCase()
                bVal = String(bVal).toLowerCase()
            }

            if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1
            if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1
            return 0
        })
    }

    function renderReminders(reminders) {
        remindersTableBody.innerHTML = ''

        if (!reminders || reminders.length === 0) {
            remindersTableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center">No results</td>
                </tr>
            `
            return
        }

        reminders.forEach(reminder => {
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${reminder.title}</td>
                <td>${reminder.customerName}</td>
                <td>${reminder.issueDate}</td>
                <td>${reminder.returnDate}</td>
            `
            remindersTableBody.appendChild(row)
        })
    }
})