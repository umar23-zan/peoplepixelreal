import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const Info = () => {
  const { categoryId, contactId } = useParams(); // Get categoryId and contactId from URL
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  
  

  // Fetch data for the contact's info (todoList, reminderList, financeList)
  useEffect(() => {
    const fetchInfo = async () => {
      const todoSnapshot = await getDocs(collection(db, `categories/${categoryId}/contacts/${contactId}/info`));
      const todoData = todoSnapshot.docs.map(doc => doc.data());
      
      // Assume the document IDs are 'todoList', 'reminderList', 'financeList'
      const todoDoc = todoData.find(doc => doc.id === 'todoList');
      

      setTodoList(todoDoc ? todoDoc.tasks : []);
      
    };

    fetchInfo();
  }, [categoryId, contactId]);

  // Add to the to-do list
  const handleAddTodo = async () => {
    if (!newTodo) return;

    const todoRef = doc(db, `categories/${categoryId}/contacts/${contactId}/info`, 'todoList');
    await updateDoc(todoRef, { tasks: [...todoList, newTodo] });
    setTodoList((prev) => [...prev, newTodo]);
    setNewTodo('');
  };

  // Render To-Do list, Reminders, and Finance similar to the example below
  return (
    <div>
      <h2>To-Do List</h2>
      <ul>
        {todoList.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="New task"
      />
      <button onClick={handleAddTodo}>Add To-Do</button>

      {/* Similar code for Reminders and Finance */}
    </div>
  );
};

export default Info;
