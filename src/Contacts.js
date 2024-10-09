import './contents.css';
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import Addmore from './icons/group_add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';

const Contacts = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams(); // Get categoryId from URL
  const [contacts, setContacts] = useState([]);
  const [newContactTitle, setNewContactTitle] = useState('');
  const [newContactImage, setNewContactImage] = useState(null);
  const [showAddMoreForm, setShowAddMoreForm] = useState(false);

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

  // Add a new contact
  const handleAddContact = async () => {
    try {
      if (!newContactTitle) {
        alert("Contact title is required.");
        return;
      }

      let imageUrl = null;
      if (newContactImage) {
        const imageRef = ref(storage, `contacts/${newContactImage.name}`);
        await uploadBytes(imageRef, newContactImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Create the contact document inside the respective category
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

  return (
    <main>
      <section className="video-grid">
        {contacts.map((contact, index) => (
          <div key={index} className="video-preview" onClick={() => navigate(`/info/${categoryId}/${contact.id}`)}>
            <img className="thumbnail" src={contact.imageUrl} alt={contact.title} />
            <p className="video-title">{contact.title}</p>
          </div>
        ))}
        <div className="video-preview" onClick={() => setShowAddMoreForm(true)}>
          <img className="thumbnail" src={Addmore} alt="addmore" />
          <p className="video-title">Add More</p>
        </div>
        {showAddMoreForm && (
          <div>
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
        )}
      </section>
    </main>
  );
};

export default Contacts;
