import './contents.css';
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import Addmore from './icons/group_add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';

import Breadcrumb from './Breadcrumb';

const Contacts = ({ searchQuery }) => {
  const breadcrumbLinks = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: 'Contacts', path: '/contacts' },
  ];

  const navigate = useNavigate();
  const { categoryId } = useParams(); // Get categoryId from URL
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [newContactTitle, setNewContactTitle] = useState('');
  const [newContactImage, setNewContactImage] = useState(null);
  const [editContactId, setEditContactId] = useState(null);
  const [showAddMoreForm, setShowAddMoreForm] = useState(false);

  // State for sorting
  const [sortField, setSortField] = useState('title'); // Default sort by title
  const [sortOrder, setSortOrder] = useState('asc'); // Default ascending order


  // Fetch contacts for the given category
  const fetchContacts = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, `categories/${categoryId}/contacts`));
    const fetchedContacts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setContacts(fetchedContacts);
  }, [categoryId]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = contacts.filter(contact =>
        contact.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts); // Reset to original contacts if search is empty
    }
  }, [searchQuery, contacts]);

  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const fieldA = a[sortField].toLowerCase(); // Convert to lower case for case-insensitive comparison
    const fieldB = b[sortField].toLowerCase();
    
    if (sortOrder === 'asc') {
      return fieldA < fieldB ? -1 : 1; // Ascending order
    } else {
      return fieldA > fieldB ? -1 : 1; // Descending order
    }
  });

  // Add a new contact
  const handleAddContact = async () => {
    try {
      if (!newContactTitle) {
        alert("Contact name is required.");
        return;
      }

      let imageUrl = null;
      if (newContactImage) {
        const imageRef = ref(storage, `contacts/${newContactImage.name}`);
        await uploadBytes(imageRef, newContactImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      const contactRef = doc(collection(db, `categories/${categoryId}/contacts`));
      await setDoc(contactRef, {
        title: newContactTitle,
        imageUrl,
      });

      setNewContactTitle('');
      setNewContactImage(null);
      setShowAddMoreForm(false);
      fetchContacts(); // Refresh the list
    } catch (error) {
      console.error("Error adding contact: ", error);
    }
  };

  // Edit an existing contact
  const handleEditContact = async (contactId) => {
    try {
      if (!newContactTitle) {
        alert("Contact name is required.");
        return;
      }

      let imageUrl = null;
      if (newContactImage) {
        const imageRef = ref(storage, `contacts/${newContactImage.name}`);
        await uploadBytes(imageRef, newContactImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      const contactRef = doc(db, `categories/${categoryId}/contacts`, contactId);
      await setDoc(contactRef, {
        title: newContactTitle,
        imageUrl,
      }, { merge: true });

      setNewContactTitle('');
      setNewContactImage(null);
      setEditContactId(null); // Close edit form
      fetchContacts(); // Refresh the list
    } catch (error) {
      console.error("Error editing contact: ", error);
    }
  };

  // Delete a contact
  const handleDeleteContact = async (contactId) => {
    try {
      const contactRef = doc(db, `categories/${categoryId}/contacts`, contactId);
      await deleteDoc(contactRef);
      fetchContacts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting contact: ", error);
    }
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-');
    setSortField(field);
    setSortOrder(order);
  };

  return (
    <main>
      <Breadcrumb links={breadcrumbLinks} />
      <div>
        {/* Dropdown for sorting */}
        <label htmlFor="sort-contacts">Sort by:</label>
        <select id="sort-contacts" onChange={handleSortChange}>
          <option value="title-asc">Name (A-Z)</option>
          <option value="title-desc">Name (Z-A)</option>
          {/* Add more sorting options if needed */}
        </select>
      </div>
      <section className="video-grid">
        {sortedContacts.map((contact, index) => (
          <div key={index} className="video-preview">
            {editContactId === contact.id ? (
              // Edit form for the contact
              <div className="form-container">
                <input
                  type="text"
                  value={newContactTitle}
                  onChange={(e) => setNewContactTitle(e.target.value)}
                  placeholder="Edit contact name"
                />
                <input
                  type="file"
                  onChange={(e) => setNewContactImage(e.target.files[0])}
                />
                <button onClick={() => handleEditContact(contact.id)}>Save</button>
                <button onClick={() => setEditContactId(null)}>Cancel</button>
              </div>
            ) : (
              // Contact details view
              <div key={index} className="video-preview" onClick={() => {
                // Pass contact details via state to the Info page
                navigate(`/info/${categoryId}/${contact.id}`, {
                  state: { contactName: contact.title, contactImage: contact.imageUrl }
                });
              }}>
                <img className="thumbnail" src={contact.imageUrl} alt={contact.title} />
                <p className="video-title">{contact.title}</p>
                <button onClick={() => setEditContactId(contact.id)}>Edit</button>
                <button onClick={() => handleDeleteContact(contact.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}

        {/* "Add More" section */}
        <div className="video-preview">
          {showAddMoreForm ? (
            <div className="form-container">
              <input
                type="text"
                value={newContactTitle}
                onChange={(e) => setNewContactTitle(e.target.value)}
                placeholder="Enter contact name"
              />
              <input
                type="file"
                onChange={(e) => setNewContactImage(e.target.files[0])}
              />
              <button onClick={handleAddContact}>Save</button>
              <button onClick={() => setShowAddMoreForm(false)}>Cancel</button>
            </div>
          ) : (
            <div onClick={() => setShowAddMoreForm(true)}>
              <img className="thumbnail" src={Addmore} alt="Add More" />
              <p className="video-title">Add More</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Contacts;
