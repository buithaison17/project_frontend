// Lấy các phần tử chính có trong phần đăng kí
const nameInputElement = document.querySelector("#name-register-input");
const emailInputElement = document.querySelector("#email-register-input");
const passwordInputElement = document.querySelector("#password-register-input");
const confirmPasswordInputElement = document.querySelector("#confirm-password-register-input");
const btnRegisterElement = document.querySelector('#btn-register');
const nextToLoginElement = document.querySelector('#btn-login');

// Lấy các phần tử thông báo trong đăng kí
const alertNameElement = document.querySelector('#alert-name');
const alertEmailElement = document.querySelector('#alert-email');
const alertPasswordElement = document.querySelector('#alert-password');
const alertConfirmPasswordElement = document.querySelector('#alert-confirm-password');

//  Lấy dữ liệu các tài khoản đã đăng kí trên local storage
const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

// Chuyển hướng nếu đã đăng nhập
const indexUser = localStorage.getItem('indexUser');

if(indexUser !== null){
    window.location.href = 'project-management.html';
}

// Lắng nghe sự kiện đăng kí tài khoản
btnRegisterElement.addEventListener('click', function(event){
    event.preventDefault();

    // Kiểm tra input
    if(nameInputElement.value === ''){
        alertNameElement.textContent = 'Họ tên không được để trống';
        nameInputElement.classList.add('wrong');
    }
    else if(!isValidateName(nameInputElement.value)){
        alertNameElement.textContent = 'Họ tên không hợp lệ';
        nameInputElement.classList.add('wrong');
    }
    else{
        alertNameElement.textContent = '';
        nameInputElement.classList.remove('wrong');
    }

    if(emailInputElement.value === ''){
        alertEmailElement.textContent = 'Email không được để trống';
        emailInputElement.classList.add('wrong')
    }
    else if(!isValidateEmail(emailInputElement.value)){
        alertEmailElement.textContent = 'Email không hợp lệ';
        emailInputElement.classList.add('wrong')
    }
    else if(accounts.some((account) => account.email === emailInputElement.value)){
        alertEmailElement.textContent = 'Email đã tồn tại';
        emailInputElement.classList.add('wrong')
    }
    else{
        alertEmailElement.textContent = '';
        emailInputElement.classList.remove('wrong')
    }

    if(passwordInputElement.value === ''){
        alertPasswordElement.textContent = 'Mật khẩu không được để trống';
        passwordInputElement.classList.add('wrong');
    }
    else if(!isValidatePassword(passwordInputElement.value)){
        alertPasswordElement.textContent = 'Mật khẩu không hợp lệ'
        passwordInputElement.classList.add('wrong');
    }
    else{
        alertPasswordElement.textContent = '';
        passwordInputElement.classList.remove('wrong');
    }

    if(confirmPasswordInputElement.value === ''){
        alertConfirmPasswordElement.textContent = 'Vui lòng nhập lại mật khẩu';
        confirmPasswordInputElement.classList.add('wrong');
    }
    else if(confirmPasswordInputElement.value !== passwordInputElement.value){
        alertConfirmPasswordElement.textContent = 'Mật khẩu không trùng nhau';
        confirmPasswordInputElement.classList.add('wrong');
    }
    else{
        alertConfirmPasswordElement.textContent = '';
        confirmPasswordInputElement.classList.remove('wrong');
    }    

    // Tiến hành tạo tài khoản mới khi dữ liệu người dùng nhập hợp lệ
    if(isValidateEmail(emailInputElement.value) && isValidateName(nameInputElement.value) && isValidatePassword(passwordInputElement.value) && passwordInputElement.value === confirmPasswordInputElement.value){
        const newAccount = {
            id: Math.ceil(Math.random()*100000),
            fullName: nameInputElement.value.trim(),
            email: emailInputElement.value.trim(),
            password: passwordInputElement.value,
        }
        
        accounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(accounts));

        nameInputElement.value = '';
        emailInputElement.value ='';
        passwordInputElement.value = '';
        confirmPasswordInputElement.value = '';

         window.location.href = 'login.html';
    }    
})

// Validate tên người dùng
function isValidateName(name){
    const regex = /^[A-Za-zÀ-ỹ\s]*[A-Za-zÀ-ỹ]+[A-Za-zÀ-ỹ\s]*$/;
    return regex.test(name);
}

//Validate email
function isValidateEmail(email){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email)
}

// Validate mật khẩu
function isValidatePassword(password) {
    return password.length >= 8;
}

// Tiến hành đi vào màn hình đăng nhập
nextToLoginElement.addEventListener('click', function(event){
    window.location.href = 'login.html';
});
