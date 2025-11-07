document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm')
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault()

        const formData = {
            username: loginForm.username.value.trim(),
            password: loginForm.password.value.trim()
        }

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })

        const result = await response.json()

        if (result.redirect) {
            window.location.href = result.redirect
        } else if (result.error) {
            alert(result.error)
        }
    })
})

