document.addEventListener('DOMContentLoaded', async () => {
    const authorSelect = document.getElementById('authorSelect')
    const birthdayElement = document.getElementById('authorBirthday')
    const bioElement = document.getElementById('authorBio')
    const wikiLink = document.getElementById('wikiLink')

    const pathParts = window.location.pathname.split('/')
    const bookId = pathParts[pathParts.length - 2]

    let authors = []
    const response = await fetch(`/api/catalog/authors/${bookId}`)
    authors = await response.json()

    const storedAuthorId = localStorage.getItem('selectedAuthorId');
    const selectedAuthor = authors.find(a => a.author_id === storedAuthorId) || authors[0];

    if (selectedAuthor) {
        authorSelect.value = selectedAuthor.author_id
        renderAuthor(selectedAuthor)
    }

    authorSelect.addEventListener('change', () => {
        const selected = authors.find(a => a.author_id === authorSelect.value)
        if (selected) renderAuthor(selected)
    })

    function renderAuthor(author) {
        birthdayElement.textContent = author.birth_date
            ? `${author.birth_date}`
            : 'Birthday unknown'

        bioElement.textContent = author.bio || 'No biography available'

        if (author.wikipedia) {
            wikiLink.href = author.wikipedia
            wikiLink.style.display = 'inline'
        } else {
            wikiLink.style.display = 'none'
        }
    }
})