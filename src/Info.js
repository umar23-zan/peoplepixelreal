import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc} from 'firebase/firestore';
import { db } from './firebase'; // Import db from firebase setup

const InfoPage = () => {
  const { categoryId, contactId } = useParams();
  const [contactData, setContactData] = useState({});
  const [todos, setTodos] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // State for new todo, reminder, and transaction
  const [newTodoText, setNewTodoText] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderDueDate, setNewReminderDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const [newTransactionText, setNewTransactionText] = useState('');
  const [newTransactionAmount, setNewTransactionAmount] = useState('');
  const [newTransactionType, setNewTransactionType] = useState('Expense');

  useEffect(() => {
    const fetchContactData = async () => {
      const contactRef = doc(db, 'categories', categoryId, 'contacts', contactId);
      const contactSnapshot = await getDoc(contactRef);
      if (contactSnapshot.exists()) {
        setContactData(contactSnapshot.data());
      }

      const infoDocRef = doc(db, 'categories', categoryId, 'contacts', contactId, 'info', 'InfoDoc');
      const infoDocSnapshot = await getDoc(infoDocRef);
      if (infoDocSnapshot.exists()) {
        const data = infoDocSnapshot.data();
        setTodos(data.todoList || []);
        setReminders(data.reminderList || []);
        setTransactions(data.financeList || []);
      }
    };

    fetchContactData();
  }, [categoryId, contactId]);

  // Adding To-Do
  const handleAddTodo = async () => {
    const updatedTodos = [...todos, { text: newTodoText, dueDate: newDueDate, priority: newPriority, completed: false }];
    setTodos(updatedTodos);
    await saveToFirestore('todoList', updatedTodos);
    setNewTodoText('');
    setNewDueDate('');
    setNewPriority('Medium');
  };

  const handleToggleComplete = async (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    await saveToFirestore('todoList', updatedTodos);
  };

  // Adding Reminder
  const handleAddReminder = async () => {
    const updatedReminders = [...reminders, { text: newReminderText, dueDate: newReminderDueDate, recurring: isRecurring }];
    setReminders(updatedReminders);
    await saveToFirestore('reminderList', updatedReminders);
    setNewReminderText('');
    setNewReminderDueDate('');
    setIsRecurring(false);
  };

  const handleDeleteReminder = async (index) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setReminders(updatedReminders);
    await saveToFirestore('reminderList', updatedReminders);
  };

  // Adding Transaction
  const handleAddTransaction = async () => {
    const updatedTransactions = [...transactions, { text: newTransactionText, amount: newTransactionAmount, type: newTransactionType }];
    setTransactions(updatedTransactions);
    await saveToFirestore('financeList', updatedTransactions);
    setNewTransactionText('');
    setNewTransactionAmount('');
    setNewTransactionType('Expense');
  };

  const handleDeleteTransaction = async (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
    await saveToFirestore('financeList', updatedTransactions);
  };

  // Save to Firebase Firestore
  const saveToFirestore = async (field, data) => {
    const contactRef = doc(db, 'categories', categoryId, 'contacts', contactId, 'info', 'InfoDoc');
    await setDoc(contactRef, { [field]: data }, { merge: true });
  };

  return (
    <div className='info-page'>
      <div className='contact-summary'>
        <img src={contactData.imageURL} alt={contactData.name} />
        <h2>{contactData.name}</h2>
      </div>
      
      {/* Todo Container */}
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
              <input type="checkbox" checked={todo.completed} onChange={() => handleToggleComplete(index)} />
              <span className="todo-text">{todo.text}</span>
              <span className="todo-date">Due: {todo.dueDate}</span>
              <span className={`todo-priority ${todo.priority.toLowerCase()}`}>{todo.priority}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Reminders */}
      <div className='reminder-container'>
        <h3>Reminders</h3>
        <div className='add-reminder-form'>
          <input type='text' placeholder='Reminder Text' value={newReminderText} onChange={(e) => setNewReminderText(e.target.value)} />
          <input type='date' value={newReminderDueDate} onChange={(e) => setNewReminderDueDate(e.target.value)} />
          <label>
            <input type='checkbox' checked={isRecurring} onChange={() => setIsRecurring(!isRecurring)} />
            Recurring
          </label>
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

      {/* Finance */}
      <div className='finance-container'>
        <h3>Finance Tracking</h3>
        <div className='add-finance-form'>
          <input type='text' placeholder='Transaction Description' value={newTransactionText} onChange={(e) => setNewTransactionText(e.target.value)} />
          <input type='number' placeholder='Amount' value={newTransactionAmount} onChange={(e) => setNewTransactionAmount(e.target.value)} />
          <select value={newTransactionType} onChange={(e) => setNewTransactionType(e.target.value)}>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
            <option value="Loan">Loan</option>
          </select>
          <button onClick={handleAddTransaction}>Add Transaction</button>
        </div>
        <ul className="finance-list">
          {transactions.map((transaction, index) => (
            <li key={index}>
              <span>{transaction.text} - ${transaction.amount} ({transaction.type})</span>
              <button onClick={() => handleDeleteTransaction(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfoPage;
