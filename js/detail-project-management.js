// Kiểm tra xem đã đăng nhập chưa
let indexUser = localStorage.getItem('indexUser');
if(indexUser === null){
    window.location.href = 'login.html';
}
indexUser = +indexUser;

// Kiểm tra xem người dùng đã chọn dự án chưa
let idProject = localStorage.getItem('idProject');
if(idProject === null){
    window.location.href = 'project-management.html';
}
idProject = +idProject;

// Lấy dữ liệu trên local storage
const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
const projects = JSON.parse(localStorage.getItem('projects')) || [];
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Lấy tên và mô tả của dự án
const projectNameElement = document.querySelector("#project-name");
const projectContentElement = document.querySelector("#project-content");

// Lấy các phần tử trên trên header
const projectsElement = document.querySelector("#projects");
const myTaskElement = document.querySelector("#my-task");
const btnLogoutElement = document.querySelector("#logout");

// Lấy các phần tử thêm và sửa nhiệm vụ
const btnAddTaskElement = document.querySelector("#btn-add-task");
const nameTaskInputElement = document.querySelector("#name-task-input");
const personInChargeInputElement = document.querySelector("#person-in-charge-input");
const statusInputElement = document.querySelector("#status-input");
const onDateInputElement = document.querySelector("#on-date-input");
const priorityInputElement = document.querySelector("#priority-input");
const progressInputElement = document.querySelector("#progress-input");

// Lấy các phần tử thêm thành viên
const modalAddMemberElement = document.querySelector("#modal-add-member");
const btnAddMemberElement = document.querySelector("#btn-add-member");
const bntCloseAddMemberElement = document.querySelector("#close-add-member");
const btnSaveAddMemberElement = document.querySelector("#save-add-member");
const btnCancelAddMemberElement = document.querySelector("#cancel-add-member");
const emailUserInviteInputElement = document.querySelector("#email-user-invite");
const roleUserInviteElement = document.querySelector("#position-user-invite");
const alertEmailMemberElement = document.querySelector("#alert-email-member");
const alertRoleMemberElement = document.querySelector("#alert-role-member");

// Lấy các phần tử trong danh sách thành viên
const memberElement = document.querySelector("#list-member");
const btnViewMember = document.querySelector("#view-all-member");

// Để lưu hàm xử lý sửa nhiệm vụ
let editHandler = null; 

// Hàm validate Email
function isValidateEmail(email){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return(regex.test(email));
}

function renderMember(){
    const indexCurrentProject = projects.findIndex(project => project.id);
    memberElement.innerHTML = projects[indexCurrentProject].member.map(member => {
        const idUser = member.userId
        const avatar = accounts[accounts.findIndex(account => account.id === idUser)].fullName.slice(0,2);
        const fullName = accounts[accounts.findIndex(account => account.id === idUser)].fullName;
        return `<div class="member">
                        <div class="avatar-member">
                            <p>${avatar}</p>
                        </div>
                        <div class="infor-member">
                            <p class="name-member">${fullName}</p>
                            <p class="position-member">${member.role}</p>
                        </div>
                    </div>`
    }).join("");    
}

renderMember();

// Xem toàn bộ danh sách thành viên
btnViewMember.addEventListener('click', function(){
    
})

// Đóng modal thêm thành viên
function closeAddMember(){
    modalAddMemberElement.style.display = 'none';
    emailUserInviteInputElement.value = '';
    emailUserInviteInputElement.classList.remove('wrong');
    roleUserInviteElement.value = '';
    roleUserInviteElement.classList.remove('wrong');
    alertEmailMemberElement.textContent = ''
    alertRoleMemberElement.textContent = ''
}

bntCloseAddMemberElement.addEventListener('click', closeAddMember);
btnCancelAddMemberElement.addEventListener('click', closeAddMember)

// Thêm thành viên
btnSaveAddMemberElement.addEventListener('click', function(){
    const indexMember = accounts.findIndex(account => account.email === emailUserInviteInputElement.value.trim());

    if(emailUserInviteInputElement.value === ''){
        alertEmailMemberElement.textContent = 'Vui lòng nhập email thành viên'
        emailUserInviteInputElement.classList.add('wrong');
        return;
    }

    if(!isValidateEmail(emailUserInviteInputElement.value)){
        alertEmailMemberElement.textContent = 'Email không hợp lệ';
        emailUserInviteInputElement.classList.add('wrong');
        return;
    }

    if(indexMember === -1){
        alertEmailMemberElement.textContent = 'Email không tồn tại';
        emailUserInviteInputElement.classList.add('wrong');
        return;
   }

    const idMember = accounts[indexMember].id;
    const indexCurrentProject = projects.findIndex(project => project.id);
    const currentProject = projects[indexCurrentProject];

    if (currentProject.member.some(member => member.userId === idMember)) {
        alertEmailMemberElement.textContent = 'Thành viên đã tồn tại';
        emailUserInviteInputElement.classList.add('wrong');
        return;
    }

    if(roleUserInviteElement.value === ''){
        alertRoleMemberElement.textContent = 'Vui lòng chọn vai trò của thành viên';
        roleUserInviteElement.classList.add('wrong');
        return;
    }

   const newMember = {
    userId: idMember,
    role: roleUserInviteElement.value,
   }

   projects[indexCurrentProject].member.push(newMember);
   localStorage.setItem('projects', JSON.stringify(projects));

})
   

// Hiển thị menu thêm thành viên
btnAddMemberElement.addEventListener('click', function(){
    modalAddMemberElement.style.display = 'flex';
})

// Lấy tiêu đề và mô tả của dự án
function writeNameContent(){
    // Lấy index của dự án thông qua id
    const indexProject = projects.findIndex(project => project.id === idProject);
    projectNameElement.textContent = projects[indexProject].projectName;
    projectContentElement.textContent = projects[indexProject].description;
}

writeNameContent();

// Lấy modal thêm nhiệm vụ
const modalAddTaskElement = document.querySelector("#modal-add-task");
const btnExitAddTaskElement = document.querySelector("#close-add-modal");
const btnCloseAddTaskElement = document.querySelector("#btn-add-close");

// Thêm nhiệm vụ
function addTask(){
    modalAddTaskElement.style.display = 'flex';
}

btnAddTaskElement.addEventListener('click', addTask);

// Đóng modal thêm nhiệm vụ
function closeAddTaskModal(){
    modalAddTaskElement.style.display = 'none';
}

btnExitAddTaskElement.addEventListener('click', closeAddTaskModal);
btnCloseAddTaskElement.addEventListener('click', closeAddTaskModal);

// Đăng xuất
btnLogoutElement.addEventListener('click', function(){
    window.location.href = 'login.html';
    localStorage.removeItem('indexUser');
    localStorage.removeItem('idProject');
})

// Quay lại trang dự án
projectsElement.addEventListener('click', function(){
    window.location.href = 'project-management.html';
    localStorage.removeItem('idProject');
})