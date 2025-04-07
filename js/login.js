// Lấy các dữ liệu chính trong phần đăng nhập
const emailInputElement = document.querySelector('#email-login-input');
const passwordInputElement = document.querySelector('#password-login-input');
const btnLoginElement = document.querySelector("#btn-login");
const btnNextRegisterElement = document.querySelector('#next-to-register');

// Lấy các thông báo khi lỗi
const alerEmailElement = document.querySelector('#alert-email');
const alerPasswordElement = document.querySelector('#alert-password');

// Lấy dữ liệu tài khoản từ local storage
const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

// Lắng nghe sự kiện đăng kí
btnLoginElement.addEventListener('click', function(event){
    event.preventDefault();
    // Kiểm tra input
    if(emailInputElement.value == ''){
        alerEmailElement.textContent = 'Email không được để trống'
    }
    else if(!isValidateEmail(emailInputElement.value)){
        alerEmailElement.textContent = 'Email nhập không hợp lệ'
    }
    else{
        alerEmailElement.textContent = '';
    }

    if(passwordInputElement.value === ''){
        alerPasswordElement.textContent = 'Mật khẩu không được để trống'
    }
    else if(!isValidatePassword(passwordInputElement.value)){
        alerPasswordElement.textContent = 'Mật khẩu không hợp lệ';
    }
    else{
        alerPasswordElement.textContent = '';
    }

    // Kiểm tra nếu người dùng nhập đúng định dạng
    if(isValidateEmail(emailInputElement.value) && isValidatePassword(passwordInputElement.value)){
        const indexUser = accounts.findIndex(account => account.email === emailInputElement.value);
        // Kiểm tra email đã được đăng kí chưa
        if(indexUser === -1){
            alerEmailElement.textContent = 'Email chưa được đăng kí';
        }
        else{
            alerEmailElement.textContent = '';
        }

        // Nếu tài khoản đã tồn tại kiểm tra
        if(indexUser !== -1 && accounts[indexUser].email === emailInputElement.value && accounts[indexUser].password !== passwordInputElement.value){
            alerPasswordElement.textContent = 'Mật khẩu không chính xác';
        }
        else{
            alerPasswordElement.textContent = '';
        }

        // Nếu nhập chính xác toàn bộ thông tin tài khoản
        if(indexUser !== -1 && accounts[indexUser].email === emailInputElement.value && accounts[indexUser].password === passwordInputElement.value){
            localStorage.setItem('indexUser', indexUser);
            window.location.href = 'project-management.html';
            alerEmailElement.textContent = '';
            alerPasswordElement.textContent = '';
            emailInputElement.value = '';
            passwordInputElement.value = '';
        }

    }
})

//Validate Email
function isValidateEmail(email){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return(regex.test(email));
}

// Validate mật khẩu
function isValidatePassword(password) {
    return password.length >= 8;
}

// Chuyển sang trang đăng kí
btnNextRegisterElement.addEventListener('click', function(){
    window.location.href = 'register.html';
})