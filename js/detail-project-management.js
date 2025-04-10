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
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

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
const alertChangeRoleMember = document.querySelector("#alert-change-role-member");

// Lấy phần tử xác nhận xóa thành viên
const modalDeleleElement = document.querySelector("#modal-delete");
const btnExitDeleteElement = document.querySelector("#close-remove-modal");
const btnCloseDeleteElement = document.querySelector("#btn-remove-cancel");
const btnSaveDeleteElement = document.querySelector("#btn-remove-confirm");

// Lấy modal thêm nhiệm vụ
const modalAddTaskElement = document.querySelector("#modal-add-task");
const btnExitAddTaskElement = document.querySelector("#close-add-modal");
const btnCloseAddTaskElement = document.querySelector("#btn-add-close");
const btnSaveAddTaskElement = document.querySelector('#btn-save-add-task');
const inputNameTaskElement = document.querySelector("#name-task-input");
const alertNameTaskElement = document.querySelector("#alert-name-task");
const inputPersonInChargeElement = document.querySelector("#person-in-charge-input");
const alertPersonTaskElement = document.querySelector("#alert-person-task");
const inputStatusElement = document.querySelector("#status-input");
const alertStatusTaskElement = document.querySelector("#alert-status-task");
const inputDateStartElement = document.querySelector("#on-date-input");
const alertDateStartElement = document.querySelector("#alert-on-date-task");
const inputDateEndElement = document.querySelector("#late-date");
const alertDateEndElement = document.querySelector("#alert-late-date-task");
const inputPriorityElement = document.querySelector("#priority-input");
const alertPriorityElement = document.querySelector("#alert-priority-task");
const inputProgressElement = document.querySelector("#progress-input");
const alertProgressElement = document.querySelector("#alert-progress-task");

// Lấy phần tử danh sách các nhiệm vụ
const btnViewTodoElement = document.querySelector("#view-todo");
const btnViewProgressElement = document.querySelector("#view-progress");
const btnViewPendingElement = document.querySelector("#view-pending");
const btnViewDoneElement = document.querySelector("#view-done");
const listTodoElement = document.querySelector('[data-category="todo"]');
const listProgressElement = document.querySelector('[data-category="in-progress"]');
const listPendingElement = document.querySelector('[data-category="pending"]');
const listDoneElement = document.querySelector('[data-category="done"]');

// Để lưu hàm xử lý sửa nhiệm vụ
let editHandler = null; 

// Lưu trữ mảng tạm thời
let tempProjects = [];
let tempTasks = [];

// Hàm validate Email
function isValidateEmail(email){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return(regex.test(email));
}

// Render danh sách member ở bên ngoài
function renderMember(projects) {
    let count = 0;
    const indexProject = projects.findIndex(project => project.id === idProject);
    memberElement.innerHTML = projects[indexProject].member.map(member => {
        if(count >= 2) return '';
        count++;
        const idUser = member.userId;
        const avatar = accounts[accounts.findIndex(account => account.id === idUser)].fullName.slice(0,2).toUpperCase();
        const fullName = accounts[accounts.findIndex(account => account.id === idUser)].fullName;
        return `
            <div class="member">
                <div class="avatar-member">
                    <p>${avatar}</p>
                </div>
                <div class="infor-member">
                    <p class="name-member">${fullName}</p>
                    <p class="position-member">${member.role}</p>
                </div>
            </div>`;
    }).join(""); 

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
                                    <select class="select-role" onchange="changeMemberRole(${index}, this.value)">
                                        ${['Project Owner', 'Developer', 'Tester'].map(role => 
                                        `<option value="${role}" ${role === roleMember ? 'selected disabled' : ''}>${role}</option>`
                                        ).join('')}
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

// Thay đổi role
function changeMemberRole(index, role){
    tempProjects = JSON.parse(localStorage.getItem('projects'));
    const indexProject = tempProjects.findIndex(project => project.id === idProject);
    const currentRole = tempProjects[indexProject].member[index].role;
    tempProjects[indexProject].member[index].role = role;
    
    if(!tempProjects[indexProject].member.some(member => member.role === 'Project Owner')){
        alertChangeRoleMember.textContent = 'Dự án không thể thiếu Project Owner';
        tempProjects[indexProject].member[index].role = currentRole;
    }
    else{
        alertChangeRoleMember.textContent = '';
    }

    renderListMember(tempProjects);
    renderMember(tempProjects);
}

// Đóng modal xem toàn bộ thành viên
function closeViewMember(){
    modalViewMember.style.display = 'none';
    alertChangeRoleMember.textContent = '';
    
    renderMember(projects);
    renderListMember(projects);
}

btnViewExitElement.addEventListener('click', closeViewMember);
btnViewCloseElement.addEventListener('click', closeViewMember);

// Xem toàn bộ danh sách thành viên
btnViewMemberElement.addEventListener('click', function(){
    modalViewMember.style.display = 'flex';
    renderListMember(projects);
})

// Lưu chỉnh sửa modal thêm thành viên
btnViewSaveElement.addEventListener('click', function(){
    localStorage.setItem('projects', JSON.stringify(tempProjects));
    projects = JSON.parse(localStorage.getItem('projects'));
    localStorage.setItem('tasks', JSON.stringify(tempTasks));
    tasks = JSON.parse(localStorage.getItem('tasks'));
    closeViewMember();
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
    let check = true;
    const indexMember = accounts.findIndex(account => account.email === emailUserInviteInputElement.value.trim());

    if(emailUserInviteInputElement.value === ''){
        emailUserInviteInputElement.classList.add('wrong');
        alertEmailMemberElement.textContent = 'Vui lòng nhập email thành viên muốn thêm'
        check = false;
    }
    else if(!isValidateEmail(emailUserInviteInputElement.value)){
        emailUserInviteInputElement.classList.add('wrong');
        alertEmailMemberElement.textContent = 'Email nhập không hợp lệ';
        check = false;
    }
    else if(indexMember === -1){
        emailUserInviteInputElement.classList.add('wrong');
        alertEmailMemberElement.textContent = 'Tài khoản chưa được đăng kí';
        check = false;
    }
    else{
        emailUserInviteInputElement.classList.remove('wrong');
        alertEmailMemberElement.textContent = '';
    }
   
    if(!check) return;

    const idMember = accounts[indexMember].id;
    const indexCurrentProject = projects.findIndex(project => project.id === idProject);
    const currentProject = projects[indexCurrentProject];

    if (currentProject.member.some(member => member.userId === idMember)) {
        alertEmailMemberElement.textContent = 'Thành viên đã tồn tại';
        emailUserInviteInputElement.classList.add('wrong');
        check = false;
    }
    else{
        emailUserInviteInputElement.classList.remove('wrong');
        alertEmailMemberElement.textContent = '';
    }
   

    if(roleUserInviteElement.value === ''){
        alertRoleMemberElement.textContent = 'Vui lòng chọn vai trò của thành viên';
        roleUserInviteElement.classList.add('wrong');
        check = false;
    }
    else{
        alertRoleMemberElement.textContent = 'Vui lòng chọn vai trò của thành viên';
        roleUserInviteElement.classList.add('wrong');
    }

    if(check){
        const newMember = {
            userId: idMember,
            role: roleUserInviteElement.value,
        }

        projects[indexCurrentProject].member.push(newMember);
        localStorage.setItem('projects', JSON.stringify(projects));
        tempProjects = JSON.parse(localStorage.getItem('projects'));
        renderMember(projects);
        closeAddMember();
    }
})

// Xóa thành viên
let memberToRemoveIndex = null;

function closeDeleteModal(){
    modalDeleleElement.style.display = 'none';
}    

function removeMember(index){
    modalDeleleElement.style.display = 'flex';
    memberToRemoveIndex = index

    btnExitDeleteElement.addEventListener('click', closeDeleteModal)
    btnCloseDeleteElement.addEventListener('click', closeDeleteModal)

    btnSaveDeleteElement.addEventListener('click', function(){
        if(memberToRemoveIndex === null) return;
        
        tempTasks = JSON.parse(localStorage.getItem("tasks"));
        const indexProject = projects.findIndex(project => project.id === idProject);
        const idUserDelete = projects[indexProject].member[index].userId;
        const taskDelete = tasks.filter(task => task.assigneeId === idUserDelete);
        
        for(let i = 0; i < taskDelete.length; i++){
            const idTaskDelete = taskDelete[i].id;
            const indexTaskDelete = tempTasks.findIndex(task => task.id === idTaskDelete);
            tempTasks.splice(indexTaskDelete, 1);
        }
         
        tempProjects = JSON.parse(localStorage.getItem('projects'));
        tempProjects[indexProject].member.splice(index, 1);
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

// Thêm nhiệm vụ
function addTask(){
    let check = true;
    const todayDate = new Date();
    let today = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

    if(inputNameTaskElement.value.trim() === ''){
        inputNameTaskElement.classList.add('wrong');
        alertNameTaskElement.textContent = 'Vui lòng nhập tên nhiệm vụ';
        check = false;
    }
    else if(inputNameTaskElement.value.length <= 8){
        inputNameTaskElement.classList.add('wrong');
        alertNameTaskElement.textContent = 'Tên nhiệm vụ phải có ít nhất 8 kí tự';
        check = false
    }
    else if(tasks.some(task => task.taskName.toLowerCase() === inputNameTaskElement.value.trim().toLowerCase())){
        inputNameTaskElement.classList.add('wrong');
        alertNameTaskElement.textContent = 'Nhiệm vụ đã tồn tại';
        check = false;
    }
    else{
        inputNameTaskElement.classList.remove('wrong');
        alertNameTaskElement.textContent = '';
    }

    if(inputPersonInChargeElement.value === ''){
        inputPersonInChargeElement.classList.add('wrong');
        alertPersonTaskElement.textContent = 'Vui lòng chọn người phụ trách';
        check = false;
    }
    else{
        inputPersonInChargeElement.classList.remove('wrong');
        alertPersonTaskElement.textContent = '';
    }

    if(inputStatusElement.value === ''){
        inputStatusElement.classList.add('wrong');
        alertStatusTaskElement.textContent = 'Vui lòng chọn trạng thái';
        check = false;
    }
    else{
        inputStatusElement.classList.remove('wrong');
        alertStatusTaskElement.textContent = '';
    }

    if(inputDateStartElement.value === ''){
        inputDateStartElement.classList.add('wrong');
        alertDateStartElement.textContent = 'Vui lòng chọn ngày bắt đầu';
        check = false;
    }
    else if(inputDateStartElement.value < today){
        inputDateStartElement.classList.add('wrong');
        alertDateStartElement.textContent = 'Ngày bắt đầu không hợp lệ';
    }
    else{
        inputDateStartElement.classList.remove('wrong');
        alertDateStartElement.textContent = '';
    }

    if(inputDateEndElement.value === ''){
        inputDateEndElement.classList.add('wrong');
        alertDateEndElement.textContent = 'Vui lòng chọn ngày kết thúc';
        check = false;
    }
    else if(new Date(inputDateStartElement.value) > new Date(inputDateEndElement.value)){
        inputDateEndElement.classList.add('wrong');
        alertDateEndElement.textContent = 'Ngày kết thúc không được trước ngày bắt đầu';
        check = false;
    }
    else{
        inputDateEndElement.classList.remove('wrong');
        alertDateEndElement.textContent = '';
    }

    if(inputPriorityElement.value === ''){
        inputPriorityElement.classList.add('wrong');
        alertPriorityElement.textContent = 'Vui lòng chọn độ ưu tiên';
        check = false;
    }
    else{
        inputPriorityElement.classList.remove('wrong');
        alertPriorityElement.textContent = '';
    }
    

    if(inputProgressElement.value === ''){
        inputProgressElement.classList.add('wrong');
        alertProgressElement.textContent = 'Vui lòng chọn tiến độ';
        check = false;
    }
    else{
        inputProgressElement.classList.remove('wrong');
        alertProgressElement.textContent = '';
    }

    if(check){
        const newTask = {
            id: Math.ceil(Math.random()*1000000),
            taskName: inputNameTaskElement.value.trim(),
            assigneeId: +inputPersonInChargeElement.value,
            projectId: idProject,
            asignDate: inputDateStartElement.value,
            dueDate: inputDateEndElement.value,
            priority: inputPriorityElement.value,
            progress: inputProgressElement.value,
            status: inputStatusElement.value,
        }    
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        closeAddTaskModal();            
    }
}

btnSaveAddTaskElement.addEventListener("click", addTask);

// Lấy danh sách thành viên khi thêm nhiệm vụ
btnAddTaskElement.addEventListener('click', function(){
    modalAddTaskElement.style.display = 'flex';
    let htmls = `<option value="">Chọn người phụ trách</option>`
    const indexProject = projects.findIndex(project => project.id === idProject);
    htmls += projects[indexProject].member.map(member => {
        const indexMember = accounts.findIndex(account => account.id === member.userId);
        const fullNameMember = accounts[indexMember].fullName;
        return `<option value="${member.userId}">${fullNameMember}</option>`        
    }).join("");
    
    inputPersonInChargeElement.innerHTML = htmls;
})

// Đóng modal thêm nhiệm vụ
function closeAddTaskModal(){
    modalAddTaskElement.style.display = 'none';
    
    inputNameTaskElement.value = '';
    inputNameTaskElement.classList.remove('wrong');
    alertNameTaskElement.textContent = '';

    inputPersonInChargeElement.value = '';
    inputPersonInChargeElement.classList.remove('wrong');
    alertPersonTaskElement.textContent = '';

    inputStatusElement.value = '';
    inputStatusElement.classList.remove('wrong');
    alertStatusTaskElement.textContent = '';

    inputDateStartElement.value = '';
    inputDateStartElement.classList.remove('wrong');
    alertDateStartElement.textContent = '';

        
    inputDateEndElement.value = '';
    inputDateEndElement.classList.remove('wrong');
    alertDateEndElement.textContent = '';

        
    inputPriorityElement.value = '';
    inputPriorityElement.classList.remove('wrong');
    alertPriorityElement.textContent = '';

    inputProgressElement.value = '';
    inputProgressElement.classList.remove('wrong');
    alertProgressElement.textContent = '';

    editHandler = null;
}

btnExitAddTaskElement.addEventListener('click', closeAddTaskModal);
btnCloseAddTaskElement.addEventListener('click', closeAddTaskModal);

// Render danh sách các nhiệm vụ
function renderTask(event){
    const target = event.target;
    
    if (target === btnViewTodoElement) {
        if (btnViewTodoElement.getAttribute('name') === 'caret-forward') {
            btnViewTodoElement.setAttribute('name', 'caret-down');
            const listTodo = tasks.filter(task => task.projectId === idProject && task.status === 'To Do');
            listTodoElement.innerHTML = listTodo.map((task) => {
                const indexUser = accounts.findIndex(account => account.id === task.assigneeId);
                const fullNameMember = accounts[indexUser].fullName;
                return `<tr>
                                <td class="name-task border">${task.taskName}</td>
                                <td class="person-in-charge border">${fullNameMember}</td>
                                <td class="border"><p class="${task.priority}">${task.priority === 'low' ? 'Thấp' : task.priority === 'medium' ? 'Trung bình' : 'Cao'}</p></td>
                                <td class="date border">${task.asignDate}</td>
                                <td class="date border">${task.dueDate}</td>
                                <td class="border"><p class="${task.progress}">${task.progress === 'on-schedule' ? 'Đúng tiến độ' : task.progress === 'risk' ? 'Rủi ro cao' : 'Trễ hạn'}</p></td>
                                <td class="border btn">
                                <span onclick = "editTask(${task.id})" class="btn-edit">Sửa</span>
                                <span onclick = "removeTask(${task.id})" class="btn-remove">Xóa</span>
                            </tr>`          
            }).join("");
        } else {
            btnViewTodoElement.setAttribute('name', 'caret-forward');
            listTodoElement.innerHTML = '';
        }
    }
    
    if (target === btnViewProgressElement) {
        if (btnViewProgressElement.getAttribute('name') === 'caret-forward') {
            btnViewProgressElement.setAttribute('name', 'caret-down');
            const listProgress = tasks.filter(task => task.projectId === idProject && task.status === 'In Progress');
            listProgressElement.innerHTML = listProgress.map((task) => {
                const indexUser = accounts.findIndex(account => account.id === task.assigneeId);
                const fullNameMember = accounts[indexUser].fullName;
                return `<tr>
                                <td class="name-task border">${task.taskName}</td>
                                <td class="person-in-charge border">${fullNameMember}</td>
                                <td class="border"><p class="${task.priority}">${task.priority === 'low' ? 'Thấp' : task.priority === 'medium' ? 'Trung bình' : 'Cao'}</p></td>
                                <td class="date border">${task.asignDate}</td>
                                <td class="date border">${task.dueDate}</td>
                                <td class="border"><p class="${task.progress}">${task.progress === 'on-schedule' ? 'Đúng tiến độ' : task.progress === 'risk' ? 'Rủi ro cao' : 'Trễ hạn'}</p></td>
                                <td class="border btn">
                                <span onclick = "editTask(${task.id})" class="btn-edit">Sửa</span>
                                <span onclick = "removeTask(${task.id})" class="btn-remove">Xóa</span>
                            </tr>`          
            }).join("");
        } else {
            btnViewProgressElement.setAttribute('name', 'caret-forward');
            listProgressElement.innerHTML = '';
        }
    }

    if(target === btnViewPendingElement){
        if(btnViewPendingElement.getAttribute('name') === 'caret-forward'){
            btnViewPendingElement.setAttribute('name', 'caret-down');
    
            const listPending = tasks.filter(task => task.projectId === idProject && task.status === 'Pending');
    
            listPendingElement.innerHTML = listPending.map((task, index) => {
                const indexUser = accounts.findIndex(account => account.id === task.assigneeId);
                const fullNameMember = accounts[indexUser].fullName;
                return `<tr>
                                <td class="name-task border">${task.taskName}</td>
                                <td class="person-in-charge border">${fullNameMember}</td>
                                <td class="border"><p class="${task.priority}">${task.priority === 'low' ? 'Thấp' : task.priority === 'medium' ? 'Trung bình' : 'Cao'}</p></td>
                                <td class="date border">${task.asignDate}</td>
                                <td class="date border">${task.dueDate}</td>
                                <td class="border"><p class="${task.progress}">${task.progress === 'on-schedule' ? 'Đúng tiến độ' : task.progress === 'risk' ? 'Rủi ro cao' : 'Trễ hạn'}</p></td>
                                <td class="border btn">
                                <span onclick = "editTask(${task.id})" class="btn-edit">Sửa</span>
                                <span onclick = "removeTask(${index})" class="btn-remove">Xóa</span>
                            </tr>`          
            }).join("");
        }
        else{
            btnViewPendingElement.setAttribute('name', 'caret-forward');
            listPendingElement.innerHTML = ''
        }
    }

    if(target === btnViewDoneElement){
        if(btnViewDoneElement.getAttribute('name') === 'caret-forward'){
            btnViewDoneElement.setAttribute('name', 'caret-down');
    
            const listDone = tasks.filter(task => task.projectId === idProject && task.status === 'Done');
    
            listDoneElement.innerHTML = listDone.map((task, index) => {
                const indexUser = accounts.findIndex(account => account.id === task.assigneeId);
                const fullNameMember = accounts[indexUser].fullName;
                return `<tr>
                                <td class="name-task border">${task.taskName}</td>
                                <td class="person-in-charge border">${fullNameMember}</td>
                                <td class="border"><p class="${task.priority}">${task.priority === 'low' ? 'Thấp' : task.priority === 'medium' ? 'Trung bình' : 'Cao'}</p></td>
                                <td class="date border">${task.asignDate}</td>
                                <td class="date border">${task.dueDate}</td>
                                <td class="border"><p class="${task.progress}">${task.progress === 'on-schedule' ? 'Đúng tiến độ' : task.progress === 'risk' ? 'Rủi ro cao' : 'Trễ hạn'}</p></td>
                                <td class="border btn">
                                <span onclick = "editTask(${task.id})" class="btn-edit">Sửa</span>
                                <span onclick = "removeTask(${task.id})" class="btn-remove">Xóa</span>
                            </tr>`          
            }).join("");
        }
        else{
            btnViewDoneElement.setAttribute('name', 'caret-forward');
            listDoneElement.innerHTML = ''
        }
    }
}

btnViewTodoElement.addEventListener('click', renderTask);
btnViewProgressElement.addEventListener('click', renderTask);
btnViewPendingElement.addEventListener('click', renderTask);
btnViewDoneElement.addEventListener('click', renderTask);

function editTask(idTask){
    modalAddTaskElement.style.display = 'flex';
    const todayDate = new Date();
    let today = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;
    const indexTask = tasks.findIndex(task => task.id === idTask);
    inputNameTaskElement.value = tasks[indexTask].taskName
    const taskOfProject = tasks.filter(task => task.projectId === idProject);

    let htmls = `<option value="">Chọn người phụ trách</option>`
    const indexProject = projects.findIndex(project => project.id === idProject);
    htmls += projects[indexProject].member.map(member => {
        const indexMember = accounts.findIndex(account => account.id === member.userId);
        const fullNameMember = accounts[indexMember].fullName;
        const isSelected = member.userId === tasks[indexTask].assigneeId ? 'selected' : '';
        return `<option value="${member.userId}" ${isSelected}>${fullNameMember}</option>`
    }).join("");
    inputPersonInChargeElement.innerHTML = htmls;

    inputStatusElement.value = tasks[indexTask].status;
    inputDateStartElement.value = tasks[indexTask].asignDate;
    inputDateEndElement.value = tasks[indexTask].dueDate;
    inputPriorityElement.value = tasks[indexTask].priority;
    inputProgressElement.value = tasks[indexTask].progress;

    editHandler = function (){
        let check = true;
        btnSaveAddTaskElement.removeEventListener('click',addTask);

        if(inputNameTaskElement.value.trim() === ''){
            alertNameTaskElement.textContent = 'Tên dự án không được để trống';
            inputNameTaskElement.classList.add('wrong');
            check = false;
        }
        else if(inputNameTaskElement.value.trim().length < 8){
            alertNameTaskElement.textContent = 'Tên nhiệm vụ phải có ít nhất 8 kí tự';
            inputNameTaskElement.classList.add('wrong');
            check = false;
        }
        else if(taskOfProject.some(task => task.taskName.toLowerCase() === inputNameTaskElement.value.trim().toLowerCase() 
        && task.id !== idTask)){
            alertNameTaskElement.textContent = 'Nhiệm vụ đã tồn tại';
            inputNameTaskElement.classList.add('wrong');
            check = false;
        }
        else{
            alertNameTaskElement.textContent = '';
            inputNameTaskElement.classList.remove('wrong');
        }

        if(inputPersonInChargeElement.value === ''){
            alertPersonTaskElement.textContent = 'Người phụ trách không được để trống';
            inputPersonInChargeElement.classList.add('wrong');
            check = false;
        }
        else{
            alertPersonTaskElement.textContent = '';
            inputPersonInChargeElement.classList.remove('wrong');
        }

        if(inputStatusElement.value === ''){
            alertStatusTaskElement.textContent = 'Trạng thái không được để trống';
            inputStatusElement.classList.add('wrong');
            check = false;
        }   
        else{
            alertStatusTaskElement.textContent = '';
            inputStatusElement.classList.remove('wrong');
        }

        if(inputDateStartElement.value === ''){
            inputDateStartElement.classList.add('wrong');
            alertDateStartElement.textContent = 'Ngày bắt đầu không được để trống';
            check = false;
        }
        else if(inputDateStartElement.value < today){
            inputDateStartElement.classList.add('wrong');
            alertDateStartElement.textContent = 'Ngày bắt đầu không được lớn hơn ngày hiện tại';
            check = false;
        }
        else{
            inputDateStartElement.classList.remove('wrong');
            alertDateStartElement.textContent = '';
        }

        if(inputDateEndElement.value === ''){
            inputDateEndElement.classList.add('wrong');
            alertDateEndElement.textContent = 'Ngày kết thúc không được để trống';
            check = false;
        }
        else if(inputDateStartElement.value > inputDateEndElement.value){
            inputDateEndElement.classList.add('wrong');
            alertDateEndElement.textContent = 'Ngày kết thúc không được lớn hơn ngày bắt dầu';
            check = false;
        }
        else{
            inputDateEndElement.classList.remove('wrong');
            alertDateEndElement.textContent = '';
        }

        if(inputPriorityElement.value === ''){
            inputPriorityElement.classList.add('wrong');
            alertPriorityElement.textContent = 'Độ ưu tiên không được để trống';
            check = false;
        }
        else{
            inputPriorityElement.classList.remove('wrong');
            alertPriorityElement.textContent = '';
        }

        if(inputProgressElement.value === ''){
            inputProgressElement.classList.add('wrong');
            alertProgressElement.textContent = 'Tiến độ nhiệm vụ không được để trống';
            check = false;
        }
        else{
            inputProgressElement.classList.remove('wrong');
            alertProgressElement.textContent = '';
        }
        if(check){
            tasks[indexTask].taskName = inputNameTaskElement.value.trim();            
            tasks[indexTask].assigneeId = +inputPersonInChargeElement.value;
            tasks[indexTask].status = inputStatusElement.value;
            tasks[indexTask].asignDate = inputDateStartElement.value;
            tasks[indexTask].dueDate = inputDateEndElement.value;
            tasks[indexTask].priority = inputPriorityElement.value;
            tasks[indexTask].progress = inputProgressElement.value;

            localStorage.setItem('tasks', JSON.stringify(tasks));
            btnSaveAddTaskElement.removeEventListener('click', editHandler);
            btnSaveAddTaskElement.addEventListener('click', addTask);
            closeAddTaskModal();
        }
    }

    btnSaveAddTaskElement.addEventListener('click', editHandler);
}

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