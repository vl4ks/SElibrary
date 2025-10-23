document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton')
    logoutButton.addEventListener('click', async () => {
        const response = await fetch('/api/auth/logout')
        const result = await response.json()

        if (result.redirect) {
            window.location.href = result.redirect
        }
    })
})
