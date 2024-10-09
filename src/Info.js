import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const Info = () => {
  const { contentId, contactId } = useParams();  // Extract contentId and contactId from URL
  const [infoData, setInfoData] = useState(null);
  const [todoItem, setTodoItem] = useState('');
  const [reminderItem, setReminderItem] = useState('');
  const [financeItem, setFinanceItem] = useState('');

  useEffect(() => {
    const fetchInfo = async () => {
      const docRef = doc(db, `contents/${contentId}/contacts/${contactId}/info`, "infoDocId");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setInfoData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchInfo();
  }, [contentId, contactId]);

  const handleAddTodo = async () => {
    const updatedTodoList = [...infoData.todoList, { text: todoItem }];
    const docRef = doc(db, `contents/${contentId}/contacts/${contactId}/info`, "infoDocId");

    await updateDoc(docRef, { todoList: updatedTodoList });
    setTodoItem('');
    setInfoData({ ...infoData, todoList: updatedTodoList });
  };

  const handleAddReminder = async () => {
    const updatedReminderList = [...infoData.reminderList, { text: reminderItem }];
    const docRef = doc(db, `contents/${contentId}/contacts/${contactId}/info`, "infoDocId");

    await updateDoc(docRef, { reminderList: updatedReminderList });
    setReminderItem('');
    setInfoData({ ...infoData, reminderList: updatedReminderList });
  };

  const handleAddFinance = async () => {
    const updatedFinanceList = [...infoData.financeList, { transaction: financeItem }];
    const docRef = doc(db, `contents/${contentId}/contacts/${contactId}/info`, "infoDocId");

    await updateDoc(docRef, { financeList: updatedFinanceList });
    setFinanceItem('');
    setInfoData({ ...infoData, financeList: updatedFinanceList });
  };

  if (!infoData) return <div>Loading...</div>;

  return (
    <div>
      <h2>{infoData.summary.name}'s Info</h2>
      <img src={infoData.summary.image} alt={infoData.summary.name} />

      <h3>Todo List</h3>
      <ul>
        {infoData.todoList.map((todo, index) => (
          <li key={index}>{todo.text}</li>
        ))}
      </ul>
      <input
        type="text"
        value={todoItem}
        onChange={(e) => setTodoItem(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>

      <h3>Reminder List</h3>
      <ul>
        {infoData.reminderList.map((reminder, index) => (
          <li key={index}>{reminder.text}</li>
        ))}
      </ul>
      <input
        type="text"
        value={reminderItem}
        onChange={(e) => setReminderItem(e.target.value)}
        placeholder="Add a new reminder"
      />
      <button onClick={handleAddReminder}>Add Reminder</button>

      <h3>Finance List</h3>
      <ul>
        {infoData.financeList.map((finance, index) => (
          <li key={index}>{finance.transaction}</li>
        ))}
      </ul>
      <input
        type="text"
        value={financeItem}
        onChange={(e) => setFinanceItem(e.target.value)}
        placeholder="Add a new transaction"
      />
      <button onClick={handleAddFinance}>Add Finance</button>
    </div>
  );
};

export default Info;
