// Kiểm tra xem đã đăng nhập chưa
let indexUser = localStorage.getItem('indexUser');
if(indexUser === null){
    window.location.href = 'login.html';
}
indexUser = +indexUser;

// Lấy dữ liệu có trong local storage
const projects = JSON.parse(localStorage.getItem('projects')) || [];
const accounts = JSON.parse(localStorage.getItem('accounts'));

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

// Lấy phần tử tìm kiếm
const searchInputElement = document.querySelector("#search-project");

// Lấy phần tử thông báo trùng tên dự án
const alerNameProjectElement = document.querySelector("#alert-name-project");

// Lấy các phần tử nút bấm chuyển trang
const btnPrevElement = document.querySelector("#btn-prev");
const btnNextElement = document.querySelector("#btn-next");
const pageNumberElement = document.querySelector("#page-number");

// Lấy phần tử danh sách project
const listProjectElement = document.querySelector("tbody");

// Lấy các phần tử modal xác nhận xóa dự án
const btnRemoveCloseModal = document.querySelector("#close-remove-modal"); 
const btnRemoveCancelModal = document.querySelector("#btn-remove-cancel");
const btnRemoveConfirmModal = document.querySelector("#btn-remove-confirm");
const modalDeleteElement = document.querySelector("#modal-delete");

// Các phần tử liên quan đến phân chia trang
let totalPage = 0;
let currentPage = 0;
let pagesProject = [];

// Tiến hành thêm dự án
btnAddProject.addEventListener('click', function(){
    modalAddProject.style.display = 'flex';
})

// Đóng modal thêm dự án
btnCloseModal.addEventListener('click', function(){
    modalAddProject.style.display = 'none';
})

// Sự kiện bấm nút hủy của modal thêm dự án
btnAddCancelElement.addEventListener('click', function(){
    modalAddProject.style.display = 'none';
})

// Sự kiện bấm ra ngoài phạm vi thêm project
modalAddProject.addEventListener('click', function(event){
    if (!mainModalAdd.contains(event.target) && !event.target.closest('.modal-head') && !event.target.closest('.btn-modal')) {
        modalAddProject.style.display = 'none';
    }
})

// Bấm lưu và tiến hành thêm project
btnAddSaveElement.addEventListener('click', function(){
    if(inputNameProjectElement.value === ''){
        alerNameProjectElement.textContent = 'Tên dự án không được để trống'
    }
    else{
        alerNameProjectElement.textContent = '';
    }

    if(inputNameProjectElement.value !== ''){
        const newProject = {
            id: projects.length+1,
            projectName: inputNameProjectElement.value.trim(),
            description: inputDescriptionProjectElement.value.trim(),
            member: [
                {
                    userId: currentUserId,
                    role: 'Project Owner',
                }
            ]
        }

        projects.push(newProject);
        inputNameProjectElement.value = '';
        inputDescriptionProjectElement.value = ''
        localStorage.setItem('projects', JSON.stringify(projects)); 
        modalAddProject.style.display = 'none';
        getListProject();        
    }
})

// Tiến hành đăng xuất tài khoản
btnLogoutElement.addEventListener('click', function(){
    localStorage.removeItem('indexUser');
    window.location.href = 'login.html';
})

// Tiến hành render ra các button chuyển trang
function renderButton(){
    let htmls = '';
    for(let i = 0; i < totalPage; i++){
        htmls += `<div onclick = "nextToPage(${i})" class = "${i == currentPage ? 'active' : ''}">${i+1}</div>`
    }
    pageNumberElement.innerHTML = htmls;
}

// Tiến hành in ra danh sách project
function renderListProject(page){
    if (!pagesProject[page]){
        listProjectElement.innerHTML = '';
        return;
    };


    listProjectElement.innerHTML = pagesProject[page].map((project, index) => {
        return `<tr>
                            <td class="id">${project.id}</td>
                            <td class="name-project">${project.projectName}</td>
                            <td colspan="3" class="action">
                                <span onclick = "editProject(${index}, ${page})" class="btn-edit">Sửa</span>
                                <span onclick = "removeProject(${index}, ${page})" class="btn-remove">Xóa</span>
                                <span onclick = "viewDetailProject(${index}, ${page})" class="btn-detail">Chi tiết</span>
                            </td>
                        </tr>`
    }).join('');
}

// Bấm xem chi tiết project
function viewDetailProject(index, page){
    const idProjectViewDetail = pagesProject[page][index].id
    localStorage.setItem('idProject', idProjectViewDetail);
    window.location.href = 'detail-project-management.html';
}

// Hàm xóa project
function removeProject(index, page) {
    modalDeleteElement.style.display = 'flex';

    btnRemoveCancelModal.onclick = function() {
        modalDeleteElement.style.display = 'none';
    };

    btnRemoveCloseModal.onclick = function() {
        modalDeleteElement.style.display = 'none';
    };

    
    btnRemoveConfirmModal.onclick = function() {
        const projectId = pagesProject[page][index].id;
        const projectIndex = projects.findIndex(proj => proj.id === projectId);

        if (projectIndex !== -1) {
            projects.splice(projectIndex, 1);
            localStorage.setItem('projects', JSON.stringify(projects));
        }

        modalDeleteElement.style.display = 'none';
    
        getListProject();

    };
}

// Hàm phân chia danh sách project
function createPageProject(myListProject){
    pagesProject = [];
    currentPage = 0;

    totalPage = Math.ceil(myListProject.length / 4);    

    if(totalPage === 1){
        btnNextElement.classList.add('disable')
        btnPrevElement.classList.add('disable');
    }
    else{
        btnNextElement.classList.remove('disable');
        btnPrevElement.classList.remove('disable');
    }

    for(let i = 0; i < myListProject.length; i+=4){
        pagesProject.push(myListProject.slice(i, i + 4));
    }

    //Render ra các nút dùng để chuyển trang
    renderButton();
    
    // Render các trang project
    renderListProject(0);
}


// Sự kiện bấm nút quay lại trang
btnPrevElement.addEventListener('click', function(){
    if(currentPage <= totalPage - 1){
        currentPage--;
        renderListProject(currentPage);
    }
    btnPrevElement.classList.toggle('disable', currentPage === 0);
    btnNextElement.classList.toggle('disable', currentPage >= totalPage - 1);
})

// Sự kiện bấm nút trang tiếp theo
btnNextElement.addEventListener('click', function(){
    if(currentPage >= 0){
        currentPage++;
        renderListProject(currentPage);
    }
    
    btnPrevElement.classList.toggle('disable', currentPage === 0);
    btnNextElement.classList.toggle('disable', currentPage >= totalPage - 1);
})

// Tiến hành lấy các dự án của người dùng
function getListProject() {
    const myListProject = projects.filter(project => 
        project.member.some(member => member.userId === currentUserId)
    );    
    currentPage = 0;

    searchInputElement.addEventListener('input', function(event) {
        const searchArray = myListProject.filter(project => 
            project.projectName.toLowerCase().includes(event.target.value.toLowerCase()) // Không có dấu chấm phẩy ở đây
        );
        createPageProject(searchArray);
        
        if(event.target.value === ''){
            createPageProject(myListProject);
        }

    });

    // Phân chia dữ thành từng trang
    createPageProject(myListProject);
}

getListProject();