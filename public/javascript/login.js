async function loginFormHandler(event) {
    event.preventDefault();
    const username = document.getElementById('usernameLogin').value;
    const pwd = document.getElementById('passwordLogin').value;

    request = {username, pwd};

    fetch('api/user/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    .then(response => {
        const login = response.json();
        return login;
    })
    .then(login => {
        console.log(login);
        if(login.status == 'success') {
            window.location.replace(login.target);
        } else {
            alert('Invalid login');
        }
    })

}
document.getElementById('loginForm').addEventListener('submit', loginFormHandler);