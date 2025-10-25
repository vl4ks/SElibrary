document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm')
    const tableBody = document.querySelector('#bookTable tbody')
    const bookCountElement = document.getElementById('bookCount')
    const maxPagesElement = document.getElementById('maxPages')
    const currentPageElement = document.querySelector('.status-bar input[type="text"]') // тот, что уже в статус-баре
    const prevPageButton = document.getElementById('prevPage')
    const nextPageButton = document.getElementById('nextPage')

    const limit = 50
    let currentPage = 1
    let maxPages = 1

    searchBooks()

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        currentPage = 1
        searchBooks()
    })

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--
            searchBooks()
        }
    })

    nextPageButton.addEventListener('click', () => {
        if (currentPage < maxPages) {
            currentPage++
            searchBooks()
        }
    })

    currentPageElement.addEventListener('change', () => {
        const val = parseInt(currentPageElement.value, 10)
        if (!isNaN(val) && val >= 1 && val <= maxPages) {
            currentPage = val
            searchBooks()
        } else {
            currentPageElement.value = currentPage
        }
    })

    async function searchBooks() {
        const title = document.getElementById('title').value.trim()
        const author = document.getElementById('author').value.trim()
        const subject = document.getElementById('subject').value.trim()

        const res = await fetch('/api/catalog/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, subject, page: currentPage })
        })

        if (!res.ok) throw new Error('Request failed')
        const { books, total } = await res.json()

        renderTable(books)
        updateStatus(total)
    }

    function renderTable(books) {
        tableBody.innerHTML = ''

        if (!books || books.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="2" style="text-align:center">No results</td></tr>`
            return
        }

        books.forEach(b => {
            const authors = b.authors.map(a => a.name).join(', ')
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${b.book}</td>
                <td>${authors}</td>
            `
            tableBody.appendChild(row)

            row.addEventListener('click', async () => {
                const res = await fetch(`/api/catalog/books/${b.book_id}`);
                const { book, covers, subjects, authors } = await res.json();

                window.renderBook(book, covers, subjects, authors);
            });
        })
    }

    function updateStatus(total) {
        bookCountElement.textContent = total
        maxPages = Math.ceil(total / limit)
        maxPagesElement.textContent = maxPages
        currentPageElement.value = currentPage
    }
})