document.addEventListener('DOMContentLoaded', async () => {
    const authorSelect = document.getElementById('authorSelect')
    const birthdayElement = document.getElementById('authorBirthday')
    const bioElement = document.getElementById('authorBio')
    const wikiLink = document.getElementById('wikiLink')

    const pathParts = window.location.pathname.split('/')
    const bookId = pathParts[pathParts.length - 1]

    let authors = []
    const response = await fetch(`/api/catalog/authors/${bookId}`)
    authors = (await response.json()).authors

    authorSelect.innerHTML = authors.map(a => `<option value="${a.authorID}">${a.name}</option>`).join('')

    const storedAuthorId = localStorage.getItem('selectedAuthorId');
    const selectedAuthor = authors.find(a => a.authorID === storedAuthorId) || authors[0];

    if (selectedAuthor) {
        authorSelect.value = selectedAuthor.authorID
        renderAuthor(selectedAuthor)
    }

    authorSelect.addEventListener('change', () => {
        const selected = authors.find(a => a.authorID === authorSelect.value)
        if (selected) renderAuthor(selected)
    })

    function renderAuthor(author) {
        if (author.birthDate) {
            birthdayElement.style.display = 'block'
            birthdayElement.textContent = author.birthDate
        } else {
            birthdayElement.style.display = 'none'
        }

        const bioH2 = bioElement.previousElementSibling
        if (author.bio) {
            bioH2.style.display = 'block'
            bioElement.style.display = 'block'
            bioElement.textContent = author.bio
        } else {
            bioH2.style.display = 'none'
            bioElement.style.display = 'none'
        }

        if (author.wikipedia) {
            wikiLink.href = author.wikipedia
            wikiLink.style.display = 'inline'
        } else {
            wikiLink.style.display = 'none'
        }
    }
})