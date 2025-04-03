// Kiểm tra xem đã đăng nhập chưa
let indexUser = localStorage.getItem('indexUser');
if(indexUser === null){
    window.location.href = 'login.html';
}
indexUser = +indexUser;

// Kiểm tra xem đã bấm chọn dự án từ trang quản lí dự án chưa
let idCurrentProject = localStorage.getItem('idProject');
if(idCurrentProject === null){
    window.location.href = 'project-management.html';
}
idCurrentProject = +idCurrentProject;

// Lấy dữ liệu từ Local Storage
const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
const projects = JSON.parse(localStorage.getItem('projects')) || [];
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Lấy các phần tử trên trên header
const projectsElement = document.querySelector("#projects");
const myTaskElement = document.querySelector("#my-task");
const btnLogoutElement = document.querySelector("#logout");

// Lấy tên và mô tả của dự án
const projectNameElement = document.querySelector("#project-name");
const projectContentElement = document.querySelector("#project-content");

// Lấy modal thêm hoặc sửa nhiệm vụ
const btnAddTaskElement = document.querySelector("#btn-add-task");
const modalAddTaskElement = document.querySelector("#modal-add-task-container");
const btnExitAddModalElement = document.querySelector("#close-add-modal");
const btnCancelAddModalElement = document.querySelector("#btn-add-close");

// Ghi lại tên và mô tả của dự án
function writeNameContent(){
    // Lấy index của dự án thông qua id
    const indexProject = projects.findIndex(project => project.id === idCurrentProject);
    projectNameElement.textContent = projects[indexProject].projectName;
    projectContentElement.textContent = projects[indexProject].description;
}

writeNameContent();

// Bấm nút thêm nhiệm vụ
btnAddTaskElement.addEventListener('click', function(){
    modalAddTaskElement.style.display = 'flex';
})

// Tắt modal
btnExitAddModalElement.addEventListener('click', function(){
    modalAddTaskElement.style.display = 'none';
})

btnCancelAddModalElement.addEventListener('click', function(){
    modalAddTaskElement.style.display = 'none';
})

// Quay trở lại trang dự án
projectsElement.addEventListener('click', function(){
    window.location.href ='project-management.html'
    localStorage.removeItem('idProject');
})

// Đăng xuất tài khoản
btnLogoutElement.addEventListener('click', function(){
    localStorage.removeItem('idProject');
    localStorage.removeItem('indexUser');
    window.location.href = 'login.html';
})