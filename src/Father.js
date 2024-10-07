import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import FatherImg from './imageFolder/Father.png'
import { useState } from 'react'
import './Father.css'


const Father = () => {

  const [todos, setTodos] = useState([
    { text: 'Buy groceries', dueDate: '2024-10-08', priority: 'High', completed: false },
    { text: 'Finish project', dueDate: '2024-10-10', priority: 'Medium', completed: false },
  ]);

  const [newTodoText, setNewTodoText] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');

  // Add new todo
  const handleAddTodo = () => {
    if (newTodoText && newDueDate && newPriority) {
      const newTodo = {
        text: newTodoText,
        dueDate: newDueDate,
        priority: newPriority,
        completed: false
      };
      setTodos([...todos, newTodo]);
      setNewTodoText('');
      setNewDueDate('');
      setNewPriority('Medium');
    }
  };

  // Toggle completion status
  const handleToggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  return (
    <div>
      <Header/>
      <Sidebar/>
      <main>
        <section className='Info-grid'>
          <div className='Info-section'>
            <div className='Info-img'>
              <img src={FatherImg} alt='father'></img>
            </div>
            <div className='Info-summary'>
              <label>Summary</label>
              <p>Name: Father</p>
              <p>Age: 45</p>
              <p>Contact no: 9500693343</p>
              <p>I love My father</p>
            </div>
          </div>
          <div className='todo-container'>
            <div className='todo-container-header'>
            <label>To-Do List</label>
            <button className='add-todo-btn' onClick={handleAddTodo}>+ Add</button>
            </div>
            
            <div className='add-todo-form'>
              <input type='text' placeholder='To-Do Task' value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)}/>
              <input 
                type="date" 
                value={newDueDate} 
                onChange={(e) => setNewDueDate(e.target.value)} 
              />
              <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
              </select>
            </div>
            <ul className="todo-list">
              {todos.map((todo, index) => (
                <li key={index} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={todo.completed} 
                    onChange={() => handleToggleComplete(index)} 
                  />
                  <span className="todo-text">{todo.text}</span>
                  <span className="todo-date">Due: {todo.dueDate}</span>
                  <span className={`todo-priority ${todo.priority.toLowerCase()}`}>{todo.priority}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        
      </main>
    </div>
  )
}

export default Father