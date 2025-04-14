// Kiểm tra xem đã đăng nhập chưa
let indexUser = localStorage.getItem('indexUser');
if(indexUser === null){
    window.location.href = 'login.html';
}
indexUser = +indexUser;

// Lấy dữ liệu trên local storage
const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Lấy các phần tử trên trên header
const projectsElement = document.querySelector("#projects");
const myTaskElement = document.querySelector("#my-task");
const btnLogoutElement = document.querySelector("#logout");

// Lấy phần tử danh sách dự án và nhiệm vụ
const listProjectElement = document.querySelector("#list-project");
const nameProjectElement = document.querySelector("#name-project");

// Đăng xuất
btnLogoutElement.addEventListener('click', function(){
    window.location.href = 'login.html';
    localStorage.removeItem('indexUser');
    localStorage.removeItem('idProject');
})

// Lấy các dự án của người dùng
const idUser = accounts[indexUser].id;
const myListProject = projects.filter(project => project.member.some(member => member.userId === idUser));

// Render Project và nhiệm vụ của người dùng
function renderProjectAndTask(){
    let htmls += myListProject.map(project => {
        const myTask = tasks.filter(task => task.assigneeId === project.id);
        if(myTask.length !== 0){
            return `<tr class="project-row">
                            <td colspan="6">
                            <div class="project-infor">
                                <ion-icon name="caret-forward"></ion-icon>
                                <p class="name-project">sơn bùi</p>
                            </div>
                            </td>
                        </tr>`
        }
    }).join('');

    listProjectElement.innerHTML = htmls;
}

renderProjectAndTask();
// Quay lại trang dự án
projectsElement.addEventListener('click', function(){
    window.location.href = 'project-management.html';
    localStorage.removeItem('idProject');
})

{/* <tr class="task-item">
    <td class="border">Tìm tài liệu</td>
    <td class="border">Cao</td>
    <td class="border">Pending</td>
    <td class="border">2024-02-24</td>
    <td class="border">2024-02-27</td>
    <td class="border">Trễ hạn</td>
</tr> */}