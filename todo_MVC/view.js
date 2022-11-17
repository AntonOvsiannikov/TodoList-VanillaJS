class View {
    constructor(id,controller) {
        this.controller = controller;
        this.todoApp = document.getElementById(id);
        this.inputField  = this.todoApp.querySelector('.new-todo');
        this.ulList = this.todoApp.querySelector('.todo-list');
        this.checkedArrow = this.todoApp.querySelector('.toggle-all');
        this.filterUlList = this.todoApp.querySelector('.filters');
        this.activeListBtn = this.filterUlList.childNodes;
        this.footerBlock = this.todoApp.querySelector('.footer')
        this.todoCountSpan = this.footerBlock.querySelector('.todo-count');
        this.btnClearComplete = this.footerBlock.querySelector('.clear-completed');
        this.initTodoList();
    }
    //Init app function
    initTodoList() {
       this.deleteSelectedClass();
       this.addNoneDisplay(this.footerBlock);
       this.addNoneDisplay(this.btnClearComplete);
       this.clearAllElement();
       this.addTodoListElement();
       this.deleteTodoListElement();
       this.toggleTodoListElement();
       this.editTodoListElement();
       this.renderBtn();
       this.clearAllCompleteBtnList();
       this.allCheckedTodo();
    }
    //Main function
    addTodoListElement() {
        this.inputField.addEventListener('blur',() => {
            this.addHelperFunction();
        })
        this.inputField.addEventListener('keypress',(e) => {
            if(e.key === 'Enter') {
               this.addHelperFunction();
            }
        })
    }
    deleteTodoListElement() {
        this.ulList.addEventListener('click', e => {
            if(e.target.className === 'destroy') {
                const todoId = e.target.parentElement.parentElement.getAttribute('data-id');
                this.controller.handlerDeleteTodoList(todoId);
            }
        })
    }
    toggleTodoListElement() {
        this.ulList.addEventListener('click',e => {
            if(e.target.className === 'toggle') {
                const id = +e.target.parentElement.parentElement.getAttribute('data-id');
                this.controller.handlerToggleTodoList(id);
            }
        })
    }
    editTodoListElement() {
        this.ulList.addEventListener('dblclick', e => {
            const targetElement = e.target.parentElement.parentElement;
            const labelElem = e.target;
            if(labelElem.tagName === 'LABEL') {
                targetElement.firstElementChild.firstElementChild.classList.toggle('edit');
                targetElement.classList.toggle('editing');
                const editInputField = this.createEditInput(targetElement,labelElem);
                const blur = this.blur.bind(this);
                editInputField.addEventListener('keypress',(e) => {
                    if(e.key === 'Enter') {
                        editInputField.removeEventListener('blur',blur);
                        this.editHelperFunction(e);
                        
                    }
                });
                editInputField.addEventListener('blur',blur);
            }
        })  
    }

    renderBtn() {
        this.filterUlList.addEventListener('click',(e) => {
            let btnElement = e.target;
            if(btnElement.tagName === 'A') {
                switch(btnElement.innerText) {
                    case 'All':
                        location.hash = '#/'
                        this.helperRenderBtn(btnElement);
                        break;
                    case 'Active':
                        location.hash = '#/active'
                        this.helperRenderBtn(btnElement);
                        break;
                    case 'Completed':
                        location.hash = '#/completed'
                        this.helperRenderBtn(btnElement);
                        break;
                }
            }
        });
    }
    addNoneDisplay(element) {
        element.style.display = 'none';
    }
    addVisibleDisplay(element) {
        element.style.display = 'block';
    }
    renderTodoList(todoArr,numActiveTodo,numCompleteTodo) {
        if(todoArr.length) {
            todoArr.forEach((todoItem) => {
                const li = document.createElement('li');
                const div = document.createElement('div');
                const input = document.createElement('input');
                const label = document.createElement('label');
                const btn = document.createElement('button');
    
                li.setAttribute('data-id', todoItem.id);
                input.setAttribute('type','checkbox');
            
            
                div.className = 'view';
                input.className = 'toggle';
                btn.className = 'destroy';
                input.checked = todoItem.checked;
    
                label.textContent = todoItem.text;
            
                this.ulList.append(li);
                li.append(div);
                div.append(input,label,btn);

                if(todoItem.checked) {
                    this.addCompletedTodoClass(todoItem.id);
                }
            })
        }
        this.todoCountSpan.innerText = `${numActiveTodo} item left`;
        this.addVisibleDisplay(this.todoCountSpan);
        this.checkedArrow.checked = (todoArr.length && todoArr.length === numCompleteTodo) ? true : false;
        (numCompleteTodo !== 0) ? this.addVisibleDisplay(this.btnClearComplete) : this.addNoneDisplay(this.btnClearComplete);
    }
    clearAllCompleteBtnList() {
        this.btnClearComplete.addEventListener('click',() => {
            this.controller.handlerDeleteAllComplete();
        })
    }
    allCheckedTodo() {
        this.checkedArrow.addEventListener('click',() => {
            if(this.ulList.childNodes[2]) {
                let state = this.checkedArrow.checked;
                (state) ? this.checkedArrow.parentNode.style.color = 'black' : this.checkedArrow.style.color = 'white';
                this.controller.handlerCheckedAllTodo(state);
            }
        })
    }
    //Support function
    startSelectedFilterPage(hashValue) {
        switch(hashValue) {
            case '#/':
                this.addSelectedFilterBarClass(this.activeListBtn[1].childNodes[1]);
                break;
            case '#/active':
                this.addSelectedFilterBarClass(this.activeListBtn[3].childNodes[1]);
                break;
            case '#/completed':
                this.addSelectedFilterBarClass(this.activeListBtn[5].childNodes[1]);
                break;
        }
    }
    blur(e) {
        if(e.target.className === 'edit') {
            this.editHelperFunction(e);
        }
    }
    helperRenderBtn(btn) {
        this.controller.handlerTakeTodoList();
        this.deleteSelectedClass();
        this.addSelectedFilterBarClass(btn);
    }
    deleteSelectedClass() {
        const childFilterUlList = this.filterUlList.children;
        Array.from(childFilterUlList).forEach((elem) => elem.children[0].classList.remove('selected'));
    }
    addSelectedFilterBarClass(element) {
        element.classList.add('selected');
    }
    addHelperFunction() {
        const todoText = this.getInputValue(this.inputField);
        this.controller.handlerAddTodoList(todoText);
        this.clearInput(this.inputField);
    }
    editHelperFunction(e) {
        const newText = this.getInputValue(e.target);
        const id = +e.target.parentElement.getAttribute('data-id');
        this.controller.handlerEditTodoList(id,newText);
    }
    addCompletedTodoClass(todoId) {
        const todoElement = this.ulList.querySelector(`li[data-id = '${todoId}']`);
        todoElement.classList.toggle('completed');
    }
    clearAllElement() {
        while(this.ulList.firstElementChild) {
            this.ulList.removeChild(this.ulList.firstElementChild);
        }
        return true;
    }
    clearInput(input) {
        input.value = '';
    }
    getInputValue(input) {
        return input.value;
    }
    createEditInput(targetElement,label) {
        let input = document.createElement('input');
        input.classList.add('edit');
        input.value = label.innerText;
        targetElement.append(input);
        input.focus();
        return input;
    }
}