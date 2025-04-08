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
const btnViewMemberElement = document.querySelector("#view-all-member");
const modalViewMember = document.querySelector("#modal-view-member");
const btnViewExitElement = document.querySelector("#close-view-modal");
const btnViewCloseElement = document.querySelector("#btn-view-close");
const btnViewSaveElement = document.querySelector("#btn-view-save");
const memberContainerElement = document.querySelector("#member-container");

// Lấy phần tử xác nhận xóa thành viên
const modalDeleleElement = document.querySelector("#modal-delete");
const btnExitDeleteElement = document.querySelector("#close-remove-modal");
const btnCloseDeleteElement = document.querySelector("#btn-remove-cancel");
const btnSaveDeleteElement = document.querySelector("#btn-remove-confirm");

// Để lưu hàm xử lý sửa nhiệm vụ
let editHandler = null; 

// Hàm validate Email
function isValidateEmail(email){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return(regex.test(email));
}

// Render danh sách member ở bên ngoài
function renderMember(projects){
    let count = 0;
    const indexProject = projects.findIndex(project => project.id === idProject);
    
    
    const avatarMembers = document.querySelectorAll('.avatar-member');
    avatarMembers.forEach(el => {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        el.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    });
}

renderMember(projects);

// Render toàn bộ danh sách member
function renderListMember(projects){
    const indexProject = projects.findIndex(project => project.id === idProject);
    console.log(indexProject);
    console.log(projects);
    
    memberContainerElement.innerHTML = projects[indexProject].member.map((member, index) => {
        const indexMember = accounts.findIndex(account => account.id === member.userId);
        const fullNameMember = accounts[indexMember].fullName;
        const emailMember = accounts[indexMember].email;
        const roleMember = member.role;
        return `<tr class="member">
                            <td class="member-left">
                                <div class="avatar-member">
                                    <p>${fullNameMember.slice(0,2).toUpperCase()}</p>
                                </div>
                                <div class="infor-member">
                                    <p class="name-member">${fullNameMember}</p>
                                    <p class="email-member">${emailMember}</p>
                                </div>
                            </td>
                            <td class="member-right">
                                <div>
                                    <select class="select-role">
                                        <option value="${roleMember}">${roleMember}</option>

                                        </select>
                                        ${roleMember !== 'Project Owner' 
                                            ? `<ion-icon onclick="removeMember(${index})" class="remove-member" name="trash-outline"></ion-icon>` 
                                            : ''
                                        }
                                </div>
                            </td>
                        </tr>`
    }).join("");

    const avatarMembers = document.querySelectorAll('.avatar-member');
    avatarMembers.forEach(el => {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        el.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    });
}

// Đóng modal xem toàn bộ thành viên
function closeViewMember(){
    modalViewMember.style.display = 'none';
}

btnViewExitElement.addEventListener('click', closeViewMember);
btnViewCloseElement.addEventListener('click', closeViewMember);

// Xem toàn bộ danh sách thành viên
btnViewMemberElement.addEventListener('click', function(){
    modalViewMember.style.display = 'flex';
    renderListMember(projects);
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
    const indexCurrentProject = projects.findIndex(project => project.id === idProject);
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
   renderMember(projects);
   closeAddMember();
})

// Xóa thành viên
function closeDeleteModal(){
    modalDeleleElement.style.display = 'none';
}

function removeMember(index){
    modalDeleleElement.style.display = 'flex';

    btnExitDeleteElement.addEventListener('click', closeDeleteModal)
    btnCloseDeleteElement.addEventListener('click', closeDeleteModal)

    btnSaveDeleteElement.addEventListener('click', function(){
        const indexProject = projects.findIndex(project => project.id === idProject);
        const tempProjects = JSON.parse(localStorage.getItem('projects'));
        tempProjects[indexProject].splice(indexProject, 1);
        renderMember(tempProjects);
        renderListMember(tempProjects);
        closeDeleteModal();
    })
}

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