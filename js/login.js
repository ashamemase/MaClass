// /js/login.js
window.headerLogin = function() {
    const email = document.getElementById('loginId').value;
    const password = document.getElementById('password').value;
    const remember = document.querySelector('input[name="loginState"]').checked;

    fetch('/pages/auth/login_process.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 
            email, 
            password,
            remember: remember ? '1' : '0'
         })
    })
    .then(response => {
        if (!response.ok) throw new Error('Login failed');
        return response.text();
    })
    .then(result => {
        if (result === 'success') {
            location.reload();
        } else {
            alert(result);
        }
    })
    .catch(() => alert('Lỗi khi đăng nhập.'));
};