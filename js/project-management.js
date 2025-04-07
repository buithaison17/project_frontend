// Kiểm tra xem đã đăng nhập chưa
let indexUser = localStorage.getItem('indexUser');
if(indexUser === null){
    window.location.href = 'login.html';
}
indexUser = +indexUser;

// Lấy dữ liệu có trong local storage
const projects = JSON.parse(localStorage.getItem('projects')) || [];
const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

// Lấy ID người dùng đang đăn nhập
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

// Phần tử liên quan đến phân trang
let totalPage = 0;
let currentPage = 1;
let myListProject;
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

// Lấy dự án của người dùng
function getProjects(){
    myListProject = projects.filter(project => 
        project.member.some(member => member.userId === currentUserId && member.role === 'Project Owner')
    );
}   

getProjects();

// Mở modal thêm dự án
btnAddProject.addEventListener('click', function(){
    modalAddProject.style.display = 'flex';
})

// Xóa dữ án lưu trữ trước đó nếu người dùng từ trang chi tiết dự án quy lại trang này
localStorage.removeItem("idProject");

// Lấy phần tử thông báo lỗi khi thêm dự án
const alerNameProjectElement = document.querySelector("#alert-name-project");

// Đóng modal thêm dự án
function closeAddProject(){
    modalAddProject.style.display = 'none';
    inputNameProjectElement.value = '';
    inputDescriptionProjectElement.value = '';
    alerNameProjectElement.textContent = '';
    inputNameProjectElement.classList.remove('wrong');
}

btnAddCancelElement.addEventListener('click', closeAddProject);
btnCloseModal.addEventListener('click', closeAddProject);

// In danh sách dự án
function renderProject(list){
    listProjectElement.innerHTML = list.map((project, index) => {
        return `<tr>
                            <td class="id">${project.id}</td>
                            <td class="name-project">${project.projectName}</td>
                            <td colspan="3" class="action">
                                <span onclick = "editProject(${index})" class="btn-edit">Sửa</span>
                                <span onclick = "removeProject(${index})" class="btn-remove">Xóa</span>
                                <span onclick = "viewProject(${index})" class="btn-detail">Chi tiết</span>
                            </td>
                        </tr>`
    }).join('');
}

// In danh sách các nút chuyển trang
function renderButton(){
    btnPagesElement.innerHTML = '';

    totalPage = Math.ceil(myListProject.length / 4);
    let start = (currentPage - 1) * 4;
    let end = start + 4;
    const result = myListProject.slice(start, end);

    for(let i = 1; i <= totalPage; i++){
        const btnPage = document.createElement('div');
        btnPage.textContent = i;
        btnPage.classList.add('btn-page');
        if (i === currentPage) btnPage.classList.add('active');

        btnPage.addEventListener('click', function(){
            currentPage = i;
            renderButton();
        });

        btnPagesElement.appendChild(btnPage);
    }

    btnPrevElement.classList.toggle('disable', currentPage === 1);
    btnNextElement.classList.toggle('disable', currentPage === totalPage);
    renderProject(result);
}

// Kiểm tra trang để disable btnPrev và btnNext
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
        renderButton();
    }
});

// Bấm nút chuyển rang tiếp theo
btnNextElement.addEventListener('click', function(){
    if(currentPage < totalPage){
        currentPage++;
        renderButton();
    }
});

renderButton();

// Hàm đóng modal xóa
function closeModalDelete(){
    modalDeleteElement.style.display = 'none';
}

// Hàm xóa project
function removeProject(index){
    modalDeleteElement.style.display = 'flex';
    btnRemoveCloseModal.addEventListener('click', closeModalDelete);
    btnRemoveCancelModal.addEventListener('click', closeModalDelete);
    btnRemoveConfirmModal.addEventListener('click', function(){
        const indexProjectDelete = projects.findIndex(project => project.id === myListProject[index].id);
        projects.splice(indexProjectDelete, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
        
        if (myListProject.length % 4 === 0 && currentPage > 1) {
            currentPage--;
        }
        
        getProjects();
        renderButton();
        closeModalDelete();                
    })
}

// Thêm danh dự ấn
function addProject(){
    if(inputNameProjectElement.value.trim() === ''){
        alerNameProjectElement.textContent = 'Tên dự án không được để trống';
        inputNameProjectElement.classList.add('wrong');
        return;
    }

    if(myListProject.some(project => project.projectName.toLowerCase() === inputNameProjectElement.value.trim().toLowerCase())){
        alerNameProjectElement.textContent = 'Dự án đã tồn tại';
        inputNameProjectElement.classList.add('wrong');
        return;
    }

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

    getProjects();
    renderButton();
    closeAddProject();
}

btnAddSaveElement.addEventListener('click', addProject);

// Sửa dự án
function editProject(index){
    modalAddProject.style.display = 'flex';
    inputNameProjectElement.value = projects[index].projectName;
    inputDescriptionProjectElement.value = projects[index].description;
    
    btnAddSaveElement.removeEventListener('click', addProject);

    editHandler = function(){
        if(inputNameProjectElement.value.trim() === ''){
            alerNameProjectElement.textContent = 'Tên dự án không được để trống';
            inputNameProjectElement.classList.add('wrong');
            return;
        }

        if (myListProject.some(proj => 
            proj.projectName.toLowerCase() === inputNameProjectElement.value.trim().toLowerCase() &&
            proj.id !== projects[index].id)) {
                alerNameProjectElement.textContent = 'Tên dự án đã tồn tại';
                inputNameProjectElement.classList.add('wrong');
                return;
        }

        projects[index].projectName = inputNameProjectElement.value.trim();
        projects[index].description = inputDescriptionProjectElement.value.trim();
        localStorage.setItem('projects', JSON.stringify(projects));

        btnAddSaveElement.removeEventListener('click', editHandler);
        btnAddSaveElement.addEventListener('click', addProject);

        getProjects();
        renderButton();
        closeAddProject();
    };

    btnAddSaveElement.addEventListener('click', editHandler);
}

// Xem chi tiết project
function viewProject(index){
    localStorage.setItem('idProject', projects[index].id);
    window.location.href = "detail-project-management.html";
}

projectsElement.addEventListener('click', function(){

});

// Tìm kiếm project
inputSearchElement.addEventListener('input', function(event){
    const searchProject = myListProject.filter(project => project.projectName.toLowerCase().includes(event.target.value.trim().toLowerCase()));
    renderProject(searchProject);
})

// Đăng xuất
btnLogoutElement.addEventListener('click', function(){
    window.location.href = 'login.html';
    localStorage.removeItem('indexUser');
    localStorage.removeItem('idProject');
})