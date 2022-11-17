class Controller {
    constructor(id) {
        this.model = new Model(id,this);
        this.view = new View(id,this);
        this.hash = window.location.hash;
        this.initLocalStorageTodo();
    }
    initLocalStorageTodo() {
        this.model.commitTodos(this.model.todoArr);
        this.view.startSelectedFilterPage(this.hash);
    }
    handlerAddTodoList(todoText) {
        this.model.addTodo(todoText);
    }
    handlerDeleteTodoList(todoId) {
        this.model.deleteTodo(todoId);
    }
    handlerToggleTodoList(todoId) {
        this.model.toggleTodo(todoId);
    }
    handlerEditTodoList(todoId,newText) {
        this.model.editTodo(todoId,newText);
    }
    handlerTakeTodoList() {
        this.model.todoListInfo();
    }
    handlerRenderTodoList(todoArr) {
        this.view.clearAllElement();
        const hashPageArray = this.filterRenderList(todoArr);
        const numActiveTodo = this.counterActiveOrCompleteTodo(todoArr,false);
        const numCompleteTodo = this.counterActiveOrCompleteTodo(todoArr,true);
        this.view.renderTodoList(hashPageArray,numActiveTodo,numCompleteTodo);
        (todoArr.length === 0) ? this.view.addNoneDisplay(this.view.footerBlock) : this.view.addVisibleDisplay(this.view.footerBlock);
    }
    handlerDeleteAllComplete() {
        this.model.deleteAllCompleteTodo();
    }
    handlerCheckedAllTodo(state) {
        this.model.checkedAllTodo(state);
    }
    counterActiveOrCompleteTodo(todoArr,state) {
        let counter = 0;
        todoArr.forEach((todoItem) => (todoItem.checked === state) ? counter++ : counter);
        return counter;
    }
    filterRenderList(todoArr) {
        switch(this.updateHashValue()) {
            case '#/':
                return todoArr;
            case '#/active':
                return todoArr.filter((todoItem) => todoItem.checked === false);
            case '#/completed':
                return todoArr.filter((todoItem) => todoItem.checked === true);
        }        
    }
    updateHashValue() {
        this.hash = (window.location.hash) ? window.location.hash : '#/';
        return this.hash;
    }
}
