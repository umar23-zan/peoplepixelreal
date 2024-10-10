import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { db } from './firebase'; 
import {  doc, getDoc, setDoc } from 'firebase/firestore';
import Breadcrumb from './Breadcrumb';

const Info = () => {
  const { categoryId, contactId } = useParams();
  const location = useLocation();
  const contactName = location.state?.contactName || "No Name Provided";
  const contactImage = location.state?.contactImage || "https://via.placeholder.com/150";

  const [todos, setTodos] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderDueDate, setNewReminderDueDate] = useState('');
  const [newTransactionText, setNewTransactionText] = useState('');
  const [newTransactionAmount, setNewTransactionAmount] = useState('');
  const [newTransactionType, setNewTransactionType] = useState('Expense');

  

  useEffect(() => {
    console.log("useEffect running with categoryId:", categoryId, "contactId:", contactId); // Check if the effect is triggered
    const fetchContactData = async () => {
      const contactDocRef = doc(db, `categories/${categoryId}/contacts`, contactId);
      const contactDoc = await getDoc(contactDocRef);
      if (contactDoc.exists()) {
        console.log(contactDocRef.path);
        
      }

      // Create Info sub-collection and InfoDoc document if it doesn't exist
      const infoDocRef = doc(db, `categories/${categoryId}/contacts/${contactId}/Info`, 'InfoDoc');
      const infoDoc = await getDoc(infoDocRef);
      if (!infoDoc.exists()) {
        console.log(infoDocRef.path);
        await setDoc(infoDocRef, {
          todos: [],
          reminders: [],
          transactions: [],
        });
      }

      // Fetch existing data
      const infoDocData = await getDoc(infoDocRef);
      if (infoDocData.exists()) {
        const data = infoDocData.data();
        setTodos(data.todos || []);
        setReminders(data.reminders || []);
        setTransactions(data.transactions || []);
      }
    };
    
    fetchContactData();
  }, [categoryId, contactId]);

  const saveToFirestore = async () => {
    const infoDocRef = doc(db, `categories/${categoryId}/contacts/${contactId}/Info`, 'InfoDoc');
    await setDoc(infoDocRef, {
      todos,
      reminders,
      transactions,
    });
  };

  const handleAddTodo = async () => {
    const newTodo = {
      text: newTodoText,
      dueDate: newDueDate,
      priority: newPriority,
      completed: false,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    await saveToFirestore();
    setNewTodoText('');
    setNewDueDate('');
  };

  const handleAddReminder = async () => {
    const newReminder = {
      text: newReminderText,
      dueDate: newReminderDueDate,
    };
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    await saveToFirestore();
    setNewReminderText('');
    setNewReminderDueDate('');
  };

  const handleAddTransaction = async () => {
    const newTransaction = {
      text: newTransactionText,
      amount: newTransactionAmount,
      type: newTransactionType,
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    await saveToFirestore();
    setNewTransactionText('');
    setNewTransactionAmount('');
  };

  const handleToggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed; // Toggle completion status
    setTodos(updatedTodos); // Update state
    saveToFirestore(); // Save updated todos to Firestore
  };

  const handleDeleteReminder = (index) => {
    const updatedReminders = reminders.filter((_, i) => i !== index); // Filter out the deleted reminder
    setReminders(updatedReminders); // Update state
    saveToFirestore(); // Save updated reminders to Firestore
  };

  const handleDeleteTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index); // Filter out the deleted transaction
    setTransactions(updatedTransactions); // Update state
    saveToFirestore(); // Save updated transactions to Firestore
  };

  const breadcrumbLinks = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: contactName || 'Contact', path: '#' }, // Current page doesn't have a link
  ];

  return (
    <div>
      <Breadcrumb links={breadcrumbLinks} />
      <h2>{contactName}</h2>
      <img src={contactImage} alt={contactName} />

      {/* To-Do List */}
      <div className='todo-container'>
        <div className='todo-container-header'>
          <label>To-Do List</label>
          <button className='add-todo-btn' onClick={handleAddTodo}>+ Add</button>
        </div>
        <div className='add-todo-form'>
          <input type='text' placeholder='To-Do Task' value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} />
          <input type='date' value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
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

      {/* Reminder Functionality */}
      <div className='reminder-container'>
        <h3>Reminders</h3>
        <div className='add-reminder-form'>
          <input 
            type='text' 
            placeholder='Reminder Text' 
            value={newReminderText} 
            onChange={(e) => setNewReminderText(e.target.value)} 
          />
          <input 
            type='date' 
            value={newReminderDueDate} 
            onChange={(e) => setNewReminderDueDate(e.target.value)} 
          />
          <button onClick={handleAddReminder}>Add Reminder</button>
        </div>
        <ul className="reminder-list">
          {reminders.map((reminder, index) => (
            <li key={index}>
              <span>{reminder.text} (Due: {reminder.dueDate})</span>
              <button onClick={() => handleDeleteReminder(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Finance Tracking Functionality */}
      <div className='finance-container'>
        <h3>Finance Tracking</h3>
        <div className='add-finance-form'>
          <input 
            type='text' 
            placeholder='Transaction Description' 
            value={newTransactionText} 
            onChange={(e) => setNewTransactionText(e.target.value)} 
          />
          <input 
            type='number' 
            placeholder='Amount' 
            value={newTransactionAmount} 
            onChange={(e) => setNewTransactionAmount(e.target.value)} 
          />
          <select value={newTransactionType} onChange={(e) => setNewTransactionType(e.target.value)}>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
            <option value="Loan">Loan</option>
          </select>
          <button onClick={handleAddTransaction}>Add Transaction</button>
        </div>
        <ul className="transaction-list">
          {transactions.map((transaction, index) => (
            <li key={index}>
              <span>{transaction.text} - {transaction.amount} ({transaction.type})</span>
              <button onClick={() => handleDeleteTransaction(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Info;
