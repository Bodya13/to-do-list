const addTask = document.querySelector('.add-task'),
allTasksNumber = document.querySelector('.all-tasks'),
doneTasksNumber = document.querySelector('.in-process-tasks'),
menuFilter = document.querySelector('.menu'),
circleFilter = document.querySelector('.circle'),
checkedFilter = document.querySelector('.checked'),
filters = Array.from(document.getElementsByClassName('filter-choise')),
tegMain = document.querySelector('main');
let chosen = 0, quantityAll, quantityDone = 0;

// window.localStorage.removeItem("MyKey");
// console.log(localStorage);

let createElement = (teg, className) => {
    let smth = document.createElement(teg);
    smth.className = className;
    return smth;
}
let createDiv = (idArg) => {
    let allDiv = [];
    let newDiv = createElement('div', 'new-task');
    newDiv.id = idArg;
    let square = createElement('div', 'square');
    let tick = createElement('img', 'tick');
    tick.src = 'img/donenew.png';
    let inputText = createElement('input', 'input-field');
    inputText.type = 'text'; 
    inputText.placeholder = 'type something';
    let pText = createElement('p', 'paragraph display-none');
    let save = createElement('button', 'button-save');
    save.innerHTML = 'save';
    let edit = createElement('button', 'button-edit display-none');
    edit.innerHTML = 'edit';
    let bin = createElement('img', 'bin');
    bin.src = 'img/bin2.png';
    newDiv.appendChild(square);
    newDiv.appendChild(tick);
    newDiv.appendChild(inputText);
    newDiv.appendChild(pText);
    newDiv.appendChild(save);
    newDiv.appendChild(edit);
    newDiv.appendChild(bin);
    tegMain.append(newDiv);
    allDiv.push(newDiv, square, tick, inputText, pText, save, edit, bin);
    return allDiv;
}
let changeDisplay = (arg1, arg2, htArr) => {
    htArr[5].style.display = arg1;
    htArr[6].style.display = arg2;
    htArr[4].style.display = arg2;
    htArr[3].style.display = arg1;
}
let filterUnderline = one => {
    filters.forEach((e, i) => {
        if(i === one){
            e.classList.add('chosen');
        }else e.classList.remove('chosen');
    });
}
let mainFilter = (par1, par2) => {
    for(let i = 0; i<allTasks.length; i++){
        let el = document.getElementById(allTasks[i].id);
        if(par1 === 'all') el.style.display = 'flex';
        else{
            if(allTasks[i].checked === true){
                el.style.display = par1;
            }else{
                el.style.display = par2;
            }
        }
    }
}
let saveFunc = (htArr, task) => {
    if(task.checked === false){
        htArr[1].style.display = 'block';
    }else {
        htArr[1].style.display = 'none';
        htArr[2].style.display = 'block';
    }
    changeDisplay('none', 'block', htArr);
    if(task.text === ''){
        task.text = htArr[3].value;
        localStorage.setItem("myKey",JSON.stringify(allTasks));
    }
    htArr[4].innerHTML = task.text;
}
let editFunc = (htArr, task) => {
    htArr[1].style.display = 'none';
    htArr[2].style.display = 'none';
    changeDisplay('block', 'none', htArr);
    htArr[3].value = task.text;
}
let squareFunc = (htArr, task) => {
    quantityRefresh(0, 1);
    htArr[4].style.textDecoration = 'line-through';
    task.checked = true;
    htArr[1].style.display = 'none';
    htArr[2].style.display = 'block';
    if(chosen === 1) htArr[0].style.display = 'none';
    localStorage.setItem("myKey",JSON.stringify(allTasks));
}
let tickFunc = (htArr, task) => {
    quantityRefresh(0, -1);
    htArr[4].style.textDecoration = 'none';
    task.checked = false;
    htArr[1].style.display = 'block';
    htArr[2].style.display = 'none';
    if(chosen === 2) htArr[0].style.display = 'none';
    localStorage.setItem("myKey",JSON.stringify(allTasks));
} 
let binFunc = (htArr, task) => {
    htArr[0].remove();
    if(task.checked) quantityRefresh(0, -1);
    quantityRefresh(-1, 0);
    let index = allTasks.findIndex(item => item.id == htArr[0].id);
    allTasks.splice(index, 1);
    localStorage.setItem("myKey",JSON.stringify(allTasks));
}
let drugDiv = (htArr, jsArray) => {
    htArr[0].draggable = true;
    htArr[0].addEventListener('dragstart', (evt) => {
        evt.target.classList.add('selected');
    });
    htArr[0].addEventListener('dragend', (evt) => {
        evt.target.classList.remove('selected');
    });
    htArr[0].addEventListener('dragover', (evt) => {
        evt.preventDefault();
        const activeElement = document.querySelector('.selected');
        const currentElement = evt.target;
        const isMoveable = activeElement !== currentElement &&
            currentElement.classList.contains('new-task');
        if (!isMoveable) {
            return;
        }
        const getNextElement = (cursorPosition, currentElement) => {
            const currentElementCoord = currentElement.getBoundingClientRect();
            const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;
            const nextElement = (cursorPosition < currentElementCenter) ?
                currentElement :
                currentElement.nextElementSibling;
            return nextElement;
        };
        const nextElement = getNextElement(evt.clientY, currentElement);
        if(nextElement === null) {
            tegMain.appendChild(activeElement)
        } else tegMain.insertBefore(activeElement, nextElement);
        // if (
        //     nextElement && 
        //     activeElement === nextElement.previousElementSibling ||
        //     activeElement === nextElement
        // )  return;
    });
}

let newTask = () => {
    quantityRefresh(1, 0);
    filterUnderline(0);
    mainFilter('all');
    // const taskId = Math.random() * 100;
    const taskId = new Date().getTime();
    let task = {
        id: taskId,
        checked: false,
        text: '',
    }
    allTasks.push(task);
    let allDiv = createDiv(taskId);

    allDiv[5].addEventListener('click', function(){
        saveFunc(allDiv, task);
    });
    allDiv[6].addEventListener('click', function(){
        editFunc(allDiv, task);
    });
    allDiv[1].addEventListener('click', function(){
        squareFunc(allDiv, task);
    });
    allDiv[2].addEventListener('click', function(){
        tickFunc(allDiv, task);
    });
    allDiv[7].addEventListener('click', function(){
        binFunc(allDiv, task);
    });

    drugDiv(allDiv, allTasks);
};

let quantityRefresh = (sign1, sign2) =>{
    quantityAll += sign1;
    allTasksNumber.innerHTML = quantityAll;
    quantityDone += sign2;
    doneTasksNumber.innerHTML = quantityDone;
}

if(localStorage.length != 0){
    allTasks = JSON.parse(localStorage.getItem("myKey"));
    filterUnderline(0);
    quantityAll = allTasks.length;
    allTasks.forEach(e => {if(e.checked === true) quantityDone++})
    allTasksNumber.innerHTML = quantityAll;
    doneTasksNumber.innerHTML = quantityDone;
}else {
    allTasks = [];
    quantityAll = 0;
    quantityDone = 0;
}

allTasks.forEach((e) => {
    let allDiv = createDiv(e.id);
    saveFunc(allDiv, e);
    if(e.checked === true) allDiv[4].style.textDecoration = 'line-through';
    allDiv[5].addEventListener('click', function(){
        saveFunc(allDiv, e);
    });
    allDiv[6].addEventListener('click', function(){
        editFunc(allDiv, e);
    });
    allDiv[1].addEventListener('click', function(){
        squareFunc(allDiv, e);
    });
    allDiv[2].addEventListener('click', function(){
        tickFunc(allDiv, e);
    });
    allDiv[7].addEventListener('click', function(){
        binFunc(allDiv, e);
    });
    drugDiv(allDiv, allTasks);
})

addTask.addEventListener('click', newTask);

menuFilter.addEventListener('click', function(){
    filterUnderline(0);
    mainFilter('all');
    chosen = 0;
})
circleFilter.addEventListener('click', function(){
    filterUnderline(1);
    mainFilter('none', 'flex');
    chosen = 1;
})
checkedFilter.addEventListener('click', function(){
    filterUnderline(2);
    mainFilter('flex', 'none');
    chosen = 2;
})  
