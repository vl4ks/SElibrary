document.addEventListener('DOMContentLoaded', () => {
    const bookHistoryForm = document.getElementById('bookHistoryForm')
    const bookIdInput = document.getElementById('bookIdInput')
    const bookTitleInput = document.getElementById('bookTitleInput')
    const bookTitle = document.getElementById('bookTitle')
    const bookHistoryResults = document.querySelector('#bookHistoryResults tbody')

    bookHistoryForm.addEventListener('submit', (e) => {
        e.preventDefault()
        searchBookHistory()
    })

    async function searchBookHistory() {
        const bookId = bookIdInput.value.trim()
        const bookTitleValue = bookTitleInput.value.trim()

        if (!bookId && !bookTitleValue)
            return

        const res = await fetch('/api/report/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId, bookTitle: bookTitleValue })
        })

        const data = await res.json()

        renderBookHistory(data)
    }

    function renderBookHistory(data) {
        if (data.title) {
            bookTitle.textContent = data.title
        }

        bookHistoryResults.innerHTML = ''

        if (!data.rows || data.rows.length === 0)
            return

        data.rows.forEach(row => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${row.customerID}</td>
                <td>${row.issueDate}</td>
                <td>${row.returnDate}</td>
            `
            bookHistoryResults.appendChild(tr)
        })
    }
})