// Kiểm tra xem đã đăng nhập chưa
let indexUser = localStorage.getItem('indexUser');
if(indexUser === null){
    window.location.href = 'login.html';
}
indexUser = +indexUser;

// Lấy dữ liệu có trong local storage
const projects = JSON.parse(localStorage.getItem('projects')) || [];
const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

// Lấy ID người dùng đang đăng nhập
const currentUserId = accounts[indexUser].id;

// Lấy các phần tử trên trên header
const projectsElement = document.querySelector("#projects");
const myTaskElement = document.querySelector("#my-task");
const btnLogoutElement = document.querySelector("#logout");

// Lấy phần tử thêm dự án
const btnAddProject = document.querySelector("#btn-add-project");
const modalAddProject = document.querySelector("#modal-add-project");
const mainModalAdd = document.querySelector("#main-modal-add");
const btnCloseModal = document.querySelector('#close-modal');
const inputNameProjectElement = document.querySelector('#name-add-project-input');
const inputDescriptionProjectElement = document.querySelector("#description-add-project-input");
const btnAddCancelElement = document.querySelector("#btn-add-cancel");
const btnAddSaveElement = document.querySelector("#btn-add-save");

// Lấy phần tử in danh sách dự án
const listProjectElement = document.querySelector("tbody");

// Lấy phần tử thông báo lỗi khi thêm dự án
const alerNameProjectElement = document.querySelector("#alert-name-project");
const alertDescriptionProjectElement = document.querySelector("#alert-description-project");

// Phần tử liên quan đến phân trang
let totalPage = 0;
let currentPage = 1;
const page = 4;
const btnPagesElement = document.querySelector("#page-number");
const btnPrevElement = document.querySelector("#btn-prev");
const btnNextElement = document.querySelector("#btn-next");

// Lấy các phần tử modal xác nhận xóa dự án
const btnRemoveCloseModal = document.querySelector("#close-remove-modal"); 
const btnRemoveCancelModal = document.querySelector("#btn-remove-cancel");
const btnRemoveConfirmModal = document.querySelector("#btn-remove-confirm");
const modalDeleteElement = document.querySelector("#modal-delete");

// Lấy phần tử tìm kiếm
const inputSearchElement = document.querySelector("#search-project");

// Để lưu hàm xử lý sửa
let editHandler = null; 

// Thêm dự án
function addProject(){
    let check = true;

    const myListProject = projects.filter(project => 
        project.member.some(member => member.userId === currentUserId && member.role === 'Project Owner')
    );

    if(inputNameProjectElement.value.trim() === ''){
        alerNameProjectElement.textContent = 'Tên dự án không được để trống';
        inputNameProjectElement.classList.add('wrong');
        check = false;
    }
    else if(myListProject.some(project => project.projectName.toLowerCase() === inputNameProjectElement.value.trim().toLowerCase())){
        alerNameProjectElement.textContent = 'Dự án đã tồn tại';
        inputNameProjectElement.classList.add('wrong');
        check = false;
    }
    else{
        alerNameProjectElement.textContent = '';
        inputNameProjectElement.classList.remove('wrong');
    }

    if(inputDescriptionProjectElement.value === ''){
        alertDescriptionProjectElement.textContent = 'Mô tả dự án không được để trống'
        inputDescriptionProjectElement.classList.add('wrong');
        check = false;
    }
    else{
        alertDescriptionProjectElement.textContent = '';
        inputDescriptionProjectElement.classList.remove('wrong');
    }

    if(check){
        const newProject = {
            id: Math.ceil(Math.random()*1000000),
            projectName: inputNameProjectElement.value.trim(),
            description: inputDescriptionProjectElement.value,
            member: [
                {
                    userId: currentUserId,
                    role: 'Project Owner'
                }
            ]
        }
    
        projects.push(newProject);
        localStorage.setItem('projects', JSON.stringify(projects));
        renderButton(projects);
        closeAddProject();
    }
}

btnAddSaveElement.addEventListener('click', addProject)

btnAddProject.addEventListener('click', function(){
    modalAddProject.style.display = 'flex';

});

// Đóng thêm dự án
function closeAddProject(){
    modalAddProject.style.display = 'none';
    inputNameProjectElement.value = '';
    inputDescriptionProjectElement.value = '';
    alerNameProjectElement.textContent = '';
    inputNameProjectElement.classList.remove('wrong');
    editHandler = null;
}

btnAddCancelElement.addEventListener('click', closeAddProject);
btnCloseModal.addEventListener('click', closeAddProject);

// Render trang project
function renderProject(projects){
    const myListProject = projects = projects.filter(project => 
        project.member.some(member => member.userId === currentUserId && member.role === 'Project Owner')
    );

    listProjectElement.innerHTML = myListProject.map(project => {
        return `<tr>
                            <td class="id">${project.id}</td>
                            <td class="name-project">${project.projectName}</td>
                            <td colspan="3" class="action">
                                <span onclick = "editProject(${project.id})" class="btn-edit">Sửa</span>
                                <span onclick = "removeProject(${project.id})" class="btn-remove">Xóa</span>
                                <span onclick = "viewProject(${project.id})" class="btn-detail">Chi tiết</span>
                            </td>
                        </tr>`
    }).join("");
}

renderButton(projects);

// In danh sách các nút chuyển trang
function renderButton(projects){
    btnPagesElement.innerHTML = '';

    const myListProject = projects.filter(project => 
        project.member.some(member => member.userId === currentUserId && member.role === 'Project Owner')
    );

    totalPage = Math.ceil(myListProject.length / page);

    let start = (currentPage - 1) * page;
    let end = start + page;
    const result = myListProject.slice(start, end);

    for(let i = 1; i <= totalPage; i++){
        const btnPage = document.createElement('div');
        btnPage.textContent = i;
        btnPage.classList.add('btn-page');
        if (i === currentPage) btnPage.classList.add('active');

        btnPage.addEventListener('click', function(){
            currentPage = i;
            renderButton(projects);
        });

        btnPagesElement.appendChild(btnPage);
    }

    btnPrevElement.classList.toggle('disable', currentPage === 1);
    btnNextElement.classList.toggle('disable', currentPage === totalPage);
    renderProject(result);
}

// Kiểm tra số trang để disable 2 nút điều hướng trang
function checkPage(){
    if(totalPage === 1 || totalPage === 0){
        btnPrevElement.classList.add('disable');
        btnNextElement.classList.add('disable');
    } else {
        btnPrevElement.classList.remove('disable');
        btnNextElement.classList.remove('disable');
    }
}

checkPage();

// Bấm nút lùi trang
btnPrevElement.addEventListener('click', function(){
    if(currentPage > 1){
        currentPage--;
        renderButton(projects);
    }
});

// Bấm nút chuyển rang tiếp theo
btnNextElement.addEventListener('click', function(){
    if(currentPage < totalPage){
        currentPage++;
        renderButton(projects);
    }
});

// Xóa dự án
let projectIndexToDelete = null;

function closeModalDelete(){
    modalDeleteElement.style.display = 'none';
    projectIndexToDelete = null
}

function removeProject(idProjectDelete){
    modalDeleteElement.style.display = 'flex';
    btnRemoveCloseModal.addEventListener('click', closeModalDelete);
    btnRemoveCancelModal.addEventListener('click', closeModalDelete);
    projectIndexToDelete = projects.findIndex(project => project.id === idProjectDelete);
}

btnRemoveConfirmModal.addEventListener('click', function(){
    projects.splice(projectIndexToDelete, 1);
    
    const myListProject = projects.filter(project => 
        project.member.some(member => member.userId === currentUserId && member.role === 'Project Owner')
    );

    if (myListProject.length % 4 === 0 && currentPage > 1) {
        currentPage--;
        }

    localStorage.setItem('projects', JSON.stringify(projects));
    renderButton(projects);
    closeModalDelete();
})

function editProject(idProject){
    modalAddProject.style.display = 'flex';

    const indexProject = projects.findIndex(project => project.id === idProject);
    inputNameProjectElement.value = projects[indexProject].projectName;
    inputDescriptionProjectElement.value = projects[indexProject].description;
    btnAddSaveElement.removeEventListener('click', addProject);
    const myListProject = projects.filter(project => 
        project.member.some(member => member.userId === currentUserId && member.role === 'Project Owner')
    );

    editHandler = function(){
        let check = true;

        if(inputNameProjectElement.value.trim() === ''){
            alerNameProjectElement.textContent = 'Tên dự án không được để trống';
            inputNameProjectElement.classList.add('wrong');
            check = false;
        }
        else if (myListProject.some(proj => 
            proj.projectName.toLowerCase() === inputNameProjectElement.value.trim().toLowerCase() &&
            proj.id !== projects[indexProject].id)) {
            
            alerNameProjectElement.textContent = 'Tên dự án đã tồn tại';
            inputNameProjectElement.classList.add('wrong');
            check = false;
        }
        else{
            alerNameProjectElement.textContent = '';
            inputNameProjectElement.classList.remove('wrong');
        }

        if(inputDescriptionProjectElement.value === ''){
            alertDescriptionProjectElement.textContent = 'Mô tả dự án không được để trống';
            inputDescriptionProjectElement.classList.add('wrong');
            check = false;
        }
        else{
            alertDescriptionProjectElement.textContent = '';
            inputDescriptionProjectElement.classList.remove('wrong');
        }
        
        if(check){
            projects[indexProject].projectName = inputNameProjectElement.value.trim();
            projects[indexProject].description = inputDescriptionProjectElement.value.trim();
            localStorage.setItem('projects', JSON.stringify(projects));
            btnAddSaveElement.removeEventListener('click', editHandler);
            btnAddSaveElement.addEventListener('click', addProject);

            renderButton(projects);
            closeAddProject();
        }    
    }

    btnAddSaveElement.addEventListener('click', editHandler);
}

// Xem chi tiết project
function viewProject(idProject){
    localStorage.setItem('idProject', idProject);
    window.location.href = 'detail-project-management.html';
}

inputSearchElement.addEventListener('input', function(event){
    const myListProject = projects.filter(project => 
        project.member.some(member => member.userId === currentUserId && member.role === 'Project Owner')
    );

    const searchProject = myListProject.filter(project => project.projectName.toLowerCase().includes(event.target.value.trim().toLowerCase()));
    
    renderProject(searchProject);
    
    if(inputSearchElement.value === ''){
        renderButton(projects);
    }
})

// Đăng xuất
btnLogoutElement.addEventListener('click', function(){
    window.location.href = 'login.html';
    localStorage.removeItem('indexUser');
    localStorage.removeItem('idProject');
})
