import { useEffect, useState } from 'react'
import './App.css'
import { Todo } from './models/todo'
import axios from 'axios'
import { parseTodo } from './utils'

const API_URL = 'http://localhost:8000/api/todos/';

const months: string[] = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec'
]

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState<string>("")
  const [date, setDate] = useState<string>("")

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try{
      const response = await axios.get(API_URL)
      const parsedTodos = response.data.map(parseTodo);
      setTodos(parsedTodos)
    } catch (error: any) {
      console.error("Error fetching todos: ", error)
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    setTodos(todos.map((todo) => 
      todo.id === id ? { ...todo, completed: !currentStatus } : todo
    ));
    try {
      const response = await axios.patch(`${API_URL}${id}/`, {
        done: !currentStatus,
      })
      setTodos(todos.map((todo) => (todo.id === id ? parseTodo(response.data) : todo)));
    } catch (error: any) {
      console.error("Error toggling todo: ", error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`${API_URL}${id}/`)
      setTodos(todos.filter((todo) => todo.id !== id))
    } catch (error: any) {
      console.error("Error deleting todo", error)
    }
  }

  const addTodo = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if(!title.trim() || !date) return

    try{
      const response = await axios.post<Todo>(API_URL, {
        title: title.trim(), 
        done: false, 
        due_at: date ?? null
      })
      setTodos([parseTodo(response.data), ...todos])
      setTitle('')
      setDate('')
    } catch (error: any) {
      console.error("Error adding todo: ", error)
    }
  }

  return (
    <div className="app-container">
      <div className="card">
        <div className="card-title">checklist</div>
        <div className="new-todo-container">
          <form onSubmit={addTodo} className="new-todo-form">
            <input
              type="text"
              placeholder="todo title..."
              value={title}
              onChange={(e) => {setTitle(e.target.value)}}
              className="todo-input"
            />
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => {setDate(e.target.value)}}
              className="todo-input"
            />
            <button type="submit" className="submit-button">
              add
            </button>
          </form>
        </div>
        <div className="todos-container">
          <ul className="todos-list">
            <li className={`todo-item`}>
              <span className="todo-text todo-data">
                <strong>title</strong>
              </span>
              <span className="due-date todo-data">
                <strong>due date</strong> 
              </span>
              <button className="delete-button todo-data" style={{color: "#1A2233"}}>
                <strong>actions</strong>
              </button>
            </li>
          </ul>
        </div>
        <hr/>
        <div className="todos-container">
          <ul className="todos-list">
            {todos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
                <span
                  onClick={()=>{toggleTodo(todo.id, todo.completed)}}
                  className="todo-text todo-data"
                >
                  {todo.title}
                </span>
                <span className="due-date todo-data">
                  {todo.due_at ? (
                    <>
                      <span className="due-date-month">
                        {months[todo.due_at.getMonth()]} 
                      </span>
                      
                      <span className="due-date-day">
                        {todo.due_at.getDate()}
                      </span>
                    </>
                  ) : (
                    <span className="due-date-placeholder">--</span>
                  )}
                </span>
                <button onClick={()=>{deleteTodo(todo.id)}} className="delete-button todo-data">
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {todos.length === 0 && <p className="empty-message">work is done.</p>}
        </div>
      </div>
    </div>
  )
}

export default App
