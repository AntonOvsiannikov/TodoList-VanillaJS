class Model {
    constructor(storageKey,controller) {
        this.todoArr = JSON.parse(localStorage.getItem(`${storageKey}`)) || [];
        this.todoArr = this.todoArr.map(todoItem => new Todo(todoItem.id,todoItem.text,todoItem.checked))
        this.controller = controller;
        this.storageKey = storageKey;
    }
    addTodo(todoText) {
        if(!todoText) {
            return;
        }
        this.todoArr.push(new Todo(false,todoText,false));
        this.commitTodos(this.todoArr);
    }
    deleteTodo(todoId) {
        this.todoArr = this.todoArr.filter((todoItem) => todoItem.id != todoId);
        this.commitTodos(this.todoArr);
    }
    toggleTodo(todoId) {
        const todo = this.todoArr.find((todoItem) => todoItem.id === todoId);
        todo.toggle(!todo.checked);
        this.commitTodos(this.todoArr);
    }
    editTodo(todoId,newText) {
        const todo = this.todoArr.find((todoItem) => todoItem.id === todoId);
        todo.newText(newText);
        this.commitTodos(this.todoArr);
    }
    todoListInfo() {
        this.commitTodos(this.todoArr);
    }
    deleteAllCompleteTodo() {
        this.todoArr = this.todoArr.filter((todoItem) => todoItem.checked === false);
        this.commitTodos(this.todoArr);
    }
    checkedAllTodo(state) {
        this.todoArr.forEach((todoItem) => todoItem.checked = state);
        this.commitTodos(this.todoArr);
    }
    commitTodos(todoArr) {
        localStorage.setItem(`${this.storageKey}`,JSON.stringify(todoArr));
        this.controller.handlerRenderTodoList(this.todoArr);
    }

}

class Todo {
    constructor(id,text,checked) {
        this.id = id || new Date().valueOf();
        this.text = text;
        this.checked = checked || false;
    }
    toggle(state) {
        this.checked = state;
    }
    newText(newText) {
        this.text = (newText != this.text) ? newText : this.text;
    }
}