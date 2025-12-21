document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.getElementById('exportButton')
    const bookIdInput = document.getElementById('bookIdInput')
    const bookTitleInput = document.getElementById('bookTitleInput')

    exportButton.addEventListener('click', () => {
        const remindersSection = document.getElementById('remindersSection')
        if (remindersSection.style.display === 'block') {
            exportReminders()
        } else {
            exportBookHistory()
        }
    })

    async function exportBookHistory() {
        const bookId = bookIdInput.value.trim()
        const bookTitleValue = bookTitleInput.value.trim()

        const res = await fetch('/api/report/export-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId, bookTitle: bookTitleValue })
        })

        if (!res.ok) {
            alert('Export failed')
            return
        }

        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${bookTitleValue.replace(/[^a-zA-Z0-9]/g, '_')}_history.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    async function exportReminders() {
        const res = await fetch('/api/report/export-reminders')

        if (!res.ok) {
            alert('Export failed')
            return
        }

        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'reminders.csv'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }
})