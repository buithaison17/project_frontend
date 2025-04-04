// Kiểm tra xem đã đăng nhập chưa
let indexUser = localStorage.getItem('indexUser');
if(indexUser === null){
    window.location.href = 'login.html';
}
indexUser = +indexUser;

// Kiểm tra xem người dùng đã chọn dự án chưa
const idProject = +localStorage.getItem('idProject');

// Lấy dữ liệu trên local storage
const accounts = JSON.parse(localStorage.getItem('accounts'));
const projects = JSON.parse(localStorage.getItem('projects'));
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Lấy tên và mô tả của dự án
const projectNameElement = document.querySelector("#project-name");
const projectContentElement = document.querySelector("#project-content");

// Lấy các phần tử trên trên header
const projectsElement = document.querySelector("#projects");
const myTaskElement = document.querySelector("#my-task");
const btnLogoutElement = document.querySelector("#logout");

// Lấy nút thêm nhiệm vụ
const btnAddTaskElement = document.querySelector("#btn-add-task");
if(idProject === null){
    window.location.href = 'project-management.html';
}

// Lấy tiêu đề và mô tả của dự án
function writeNameContent(){
    // Lấy index của dự án thông qua id
    const indexProject = projects.findIndex(project => project.id === idProject);
    projectNameElement.textContent = projects[indexProject].projectName;
    projectContentElement.textContent = projects[indexProject].description;
}

writeNameContent();

// Lấy modal thêm nhiệm vụ
const modalAddTaskElement = document.querySelector("#modal-add-task-container");
const btnExitAddTaskElement = document.querySelector("#close-add-modal");
const btnCloseAddTaskElement = document.querySelector("#btn-add-close");
// Bấm nút thêm nhiệm vụ
btnAddTaskElement.addEventListener('click', function(){
    modalAddTaskElement.style.display = 'flex';
})

// Đóng modal thêm nhiệm vụ
function closeAddTaskModal(){
    modalAddTaskElement.style.display = 'none';
}

btnExitAddTaskElement.addEventListener('click', closeAddTaskModal);
btnCloseAddTaskElement.addEventListener('click', closeAddTaskModal);