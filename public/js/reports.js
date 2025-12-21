document.addEventListener('DOMContentLoaded', () => {
    const remindersButton = document.getElementById('remindersButton')
    const bookHistoryButton = document.getElementById('bookHistoryButton')
    const remindersSection = document.getElementById('remindersSection')
    const bookHistorySection = document.getElementById('bookHistorySection')

    remindersSection.style.display = 'block'
    bookHistorySection.style.display = 'none'

    document.getElementById('exportButton').style.display = 'block'

    remindersButton.addEventListener('click', () => {
        remindersSection.style.display = 'block'
        bookHistorySection.style.display = 'none'
    })

    bookHistoryButton.addEventListener('click', () => {
        remindersSection.style.display = 'none'
        bookHistorySection.style.display = 'grid'
    })
})
