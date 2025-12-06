document.addEventListener('DOMContentLoaded', () => {
    const bookSection = document.querySelector('.book')
    if (!bookSection) return

    bookSection.style.display = 'none'

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
        bookSection.style.display = 'grid'
        titleElement.textContent = book.title || 'Untitled'

        if (authorsData.length > 0) {
            authorsContainer.innerHTML = authorsData.map(a =>
                `<a class="author-link" data-book-id="${book.bookID}" data-author-id="${a.authorID}">${a.name}</a>`
            ).join(', ')
        } else {
            authorsContainer.innerHTML = `<span>No authors</span>`
        }

        const yearP = yearElement.parentElement
        if (book.firstPublished) {
            yearP.style.display = 'block'
            const year = book.firstPublished.split('.')[2]
            yearElement.textContent = year
        } else {
            yearP.style.display = 'none'
        }

        const descH2 = descElement.previousElementSibling
        if (book.description) {
            descH2.style.display = 'block'
            descElement.style.display = 'block'
            descElement.textContent = book.description
        } else {
            descH2.style.display = 'none'
            descElement.style.display = 'none'
        }

        const subjectsH2 = subjectsElement.previousElementSibling
        if (subjectsData.length > 0) {
            subjectsH2.style.display = 'block'
            subjectsElement.style.display = 'block'
            subjectsElement.textContent = subjectsData.map(s => s.topic).join(', ')
        } else {
            subjectsH2.style.display = 'none'
            subjectsElement.style.display = 'none'
        }

        covers = coversData
        currentCoverIndex = 0
        updateCover()
    }

    function updateCover() {
        const filePath = covers.length > 0 ? covers[currentCoverIndex].filePath : 'defaultbookpreview.png'
        coverImage.src = '../img/covers/' + filePath
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

            window.location.href = `/catalog/authors/${bookId}`

            localStorage.setItem('selectedAuthorId', authorId)
        }
    })
})
