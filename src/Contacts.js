import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { db, storage } from './firebase'; // Ensure storage is exported from firebase.js
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Contacts = () => {
  const { categoryId } = useParams();
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch contacts from Firestore
  const fetchContacts = useCallback(async () => {
    const contactsCollection = collection(db, `categories/${categoryId}/contacts`);
    const contactsSnapshot = await getDocs(contactsCollection);
    const contactsList = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setContacts(contactsList);
  }, [categoryId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !image) return; // Validate inputs

    // Upload the image to Firebase Storage
    const storageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);

    // Add the new contact to Firestore
    await addDoc(collection(db, `categories/${categoryId}/contacts`), {
      name,
      imageUrl,
    });

    setName('');
    setImage(null);
    fetchContacts(); // Refresh the contacts list
  };

  // Navigate to the contact's Info page
  const handleContactClick = (contactId) => {
    navigate(`/categories/${categoryId}/contacts/${contactId}/info`);
  };

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return (
    <div>
      <h1>Contacts in {categoryId}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Contact Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Add Contact</button>
      </form>

      <h2>Contact List:</h2>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id} onClick={() => handleContactClick(contact.id)} style={{ cursor: 'pointer' }}>
            <h3>{contact.name}</h3>
            {contact.imageUrl && <img src={contact.imageUrl} alt={contact.name} width="100" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
