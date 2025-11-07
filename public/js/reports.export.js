document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.getElementById('exportButton')
    const bookIdInput = document.getElementById('bookIdInput')
    const bookTitleInput = document.getElementById('bookTitleInput')

    exportButton.addEventListener('click', () => {
        exportToCSV()
    })

    async function exportToCSV() {
        const bookId = bookIdInput.value.trim()
        const bookTitleValue = bookTitleInput.value.trim()

        const res = await fetch('/api/report/export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId, bookTitle: bookTitleValue })
        })

        if (!res.ok) {
            alert(res.error || 'Export failed')
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
})