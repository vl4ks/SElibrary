document.addEventListener('DOMContentLoaded', () => {
    const bookSection = document.querySelector('.book')
    if (!bookSection) return

    const titleElement = document.getElementById('bookTitle')
    const authorsContainer = document.getElementById('bookAuthors')
    const yearElement = document.getElementById('bookYear')
    const descElement = document.getElementById('bookDescription')
    const subjectsElement = document.getElementById('bookSubjects')
    const coverImage = document.getElementById('bookCoverImage')
    const prevButton = document.getElementById('prevCover')
    const nextButton = document.getElementById('nextCover')

    let currentCoverIndex = 0
    let covers = []

    window.renderBook = function (book, coversData = [], subjectsData = [], authorsData = []) {
        titleElement.textContent = book.title || 'Untitled'

        if (authorsData.length > 0) {
            authorsContainer.innerHTML = authorsData.map(a =>
                `<a class="author-link" data-book-id="${book.bookID}" data-author-id="${a.authorID}">${a.name}</a>`
            ).join(', ')
        } else {
            authorsContainer.innerHTML = `<span>No authors</span>`
        }

        yearElement.textContent = `first published: ${book.firstPublished || 'unknown'}`
        descElement.textContent = book.description || 'No description available'
        subjectsElement.textContent = subjectsData.length
            ? subjectsData.map(s => s.topic).join(', ')
            : 'No subjects.'

        covers = coversData
        currentCoverIndex = 0
        updateCover()
    }

    function updateCover() {
        if (covers.length > 0) {
            coverImage.src = covers[currentCoverIndex].filePath
        } else {
            coverImage.src = '../img/defaultbookpreview.png'
        }
    }

    prevButton.addEventListener('click', () => {
        if (covers.length === 0) return
        currentCoverIndex = (currentCoverIndex - 1 + covers.length) % covers.length
        updateCover()
    })

    nextButton.addEventListener('click', () => {
        if (covers.length === 0) return
        currentCoverIndex = (currentCoverIndex + 1) % covers.length
        updateCover()
    })

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('author-link')) {
            e.preventDefault()
            const bookId = e.target.dataset.bookId
            const authorId = e.target.dataset.authorId

            window.open(`/catalog/authors/${bookId}`, '_blank')

            localStorage.setItem('selectedAuthorId', authorId)
        }
    })
})
