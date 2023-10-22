const cl = console.log;

const submitform = document.getElementById("submitform");
const inputcontrol = document.getElementById("inputcontrol");
const licontainer = document.getElementById("licontainer");
const submtbtn = document.getElementById("submtbtn");
const updatebtn = document.getElementById("updatebtn");

todoArr = [];

const onEdit = eve => {
    let getid = eve.closest("li").id;
    localStorage.setItem("editId",getid);
    let getidobj = todoArr.find(todo => todo.todoId === getid);
    inputcontrol.value = getidobj.todoItem;
    submtbtn.classList.add("d-none");
    updatebtn.classList.remove("d-none")
}

const onUpdate = () => {
    let updatedvalue = inputcontrol.value;
    let getid = localStorage.getItem("editId");
    let getindex = todoArr.findIndex(todo => todo.todoId === getid);
    let duplicate = todoArr.some(todo => todo.todoItem === updatedvalue);
    if(duplicate){
        Swal.fire(`${updatedvalue} is already Added!`);
    }else{
        Swal.fire({
            icon: 'success',
            title: 'Done',
            text: 'ToDo Item Updated!!!',
            timer: 2000
          })
        todoArr[getindex].todoItem = updatedvalue;
        localStorage.setItem("todoArray", JSON.stringify(todoArr));
        todotemplating(todoArr);
    }
    updatebtn.classList.add("d-none")
    submtbtn.classList.remove("d-none");
    submitform.reset();
}


const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
})

const onRemove = eve => {
    let getid = eve.closest('li').id;
    let getindex = todoArr.findIndex(todo => todo.todoId === getid);
    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: `You want to delete ${todoArr[getindex].todoItem}!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success',
            '1500'
          )
            todoArr.splice(getindex,1);
            localStorage.setItem("todoArray", JSON.stringify(todoArr));
            todotemplating(todoArr);
        } else if (

          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error',
            '1500'
          )
        }
      })
    
}


const todotemplating = ele => {
    let result = "<ul class ='list-group font-weight-bold'>"
    ele.forEach(eve => {
        result += `
            <li class ="list-group-item p-3 d-flex justify-content-between align-items-center licontainer" id="${eve.todoId}">
                <span>${eve.todoItem}</span>
                <span>
                <button class="btn btn-primary" onclick=onEdit(this)>Edit</button>
                <button class="btn btn-Danger" onclick=onRemove(this)>Delete</button>
                </span>
            </li>
        `
    })
    result += "</ul>";
    licontainer.innerHTML = result;
}

if(localStorage.getItem("todoArray")){
    todoArr = JSON.parse(localStorage.getItem("todoArray"))
}
todotemplating(todoArr);

const onSubmit = eve => {
    eve.preventDefault();
    let createobj = {
        todoItem : inputcontrol.value,
        todoId : uuidv4()
    }
    let getvalue = inputcontrol.value;
    let removedupl = todoArr.some(todo => todo.todoItem.toLowerCase() === getvalue.toLowerCase());
    if(removedupl){
        Swal.fire(`${createobj.todoItem} is already Added!`)
        eve.target.reset();
    }else{
        Swal.fire({
            icon: 'success',
            title: 'Done',
            text: 'ToDo Item Added!!!',
            timer: 2000
          })
        todoArr.push(createobj);
        localStorage.setItem("todoArray", JSON.stringify(todoArr));
        todotemplating(todoArr);
        eve.target.reset();
    }
}


submitform.addEventListener('submit', onSubmit);
updatebtn.addEventListener('click', onUpdate)


function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

