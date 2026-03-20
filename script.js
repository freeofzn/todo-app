// Todo 관리 객체
const todoApp = {
    todos: [],
    currentFilter: 'all',

    // 초기화
    init() {
        this.loadTodos();
        this.setupEventListeners();
        this.render();
    },

    // 이벤트 리스너 설정
    setupEventListeners() {
        const addBtn = document.getElementById('addBtn');
        const todoInput = document.getElementById('todoInput');
        const filterBtns = document.querySelectorAll('.filter-btn');

        // 추가 버튼 클릭
        addBtn.addEventListener('click', () => this.addTodo());

        // 엔터키 입력
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // 필터 버튼 클릭
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });
    },

    // 새로운 todo 추가
    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (text === '') {
            alert('할 일을 입력하세요!');
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString('ko-KR')
        };

        this.todos.push(newTodo);
        this.saveTodos();
        input.value = '';
        input.focus();
        this.render();
    },

    // todo 삭제
    deleteTodo(id) {
        if (confirm('정말 삭제하시겠습니까?')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveTodos();
            this.render();
        }
    },

    // todo 완료 상태 토글
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    },

    // 필터링된 todos 가져오기
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            case 'all':
            default:
                return this.todos;
        }
    },

    // 화면 렌더링
    render() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();

        // 빈 상태
        if (this.todos.length === 0) {
            todoList.innerHTML = '<div class="empty-message">할 일을 추가해주세요!</div>';
            this.updateStats();
            return;
        }

        // 필터된 todos가 없는 경우
        if (filteredTodos.length === 0) {
            const filterName = this.currentFilter === 'all' ? '할 일' : 
                             this.currentFilter === 'active' ? '진행중인 할 일' : '완료된 할 일';
            todoList.innerHTML = `<div class="empty-message">${filterName}이 없습니다.</div>`;
            this.updateStats();
            return;
        }

        // todos 렌더링
        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="todoApp.toggleTodo(${todo.id})"
                >
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="todoApp.deleteTodo(${todo.id})">삭제</button>
            </li>
        `).join('');

        this.updateStats();
    },

    // 통계 업데이트
    updateStats() {
        const totalCount = document.getElementById('totalCount');
        const completedCount = document.getElementById('completedCount');
        const completed = this.todos.filter(todo => todo.completed).length;

        totalCount.textContent = `총: ${this.todos.length}`;
        completedCount.textContent = `완료: ${completed}`;
    },

    // 로컬 스토리지에 저장
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    },

    // 로컬 스토리지에서 로드
    loadTodos() {
        const stored = localStorage.getItem('todos');
        this.todos = stored ? JSON.parse(stored) : [];
    },

    // XSS 방지를 위한 HTML 이스케이프
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    todoApp.init();
});
