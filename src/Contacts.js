import './contents.css';
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase"; // Import Firestore db and Firebase Storage
import Addmore from './icons/group_add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg'; // Add More icon
import Delete from './icons/delete_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import Edit from './icons/person_edit_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';

const Contacts = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams(); // Get categoryId from the URL
  const [contacts, setContacts] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [newContactTitle, setNewContactTitle] = useState('');
  const [newContactImage, setNewContactImage] = useState(null);
  const [showAddMoreForm, setShowAddMoreForm] = useState(false);

  // Fetch contacts from Firestore
  const fetchContacts = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, `categories/${categoryId}/contacts`));
    const fetchedContacts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setContacts(fetchedContacts);
  }, [categoryId]); // Include categoryId in the dependencies

  useEffect(() => {
    fetchContacts(); // Fetch contacts when the component mounts or categoryId changes
  }, [fetchContacts]); // Include fetchContacts in the dependencies

  // Delete a contact
  const handleDelete = async (id, imageUrl) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, `categories/${categoryId}/contacts`, id));

      // Delete the image from Firebase Storage (optional)
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }

      fetchContacts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting contact: ", error);
    }
  };

  // Start editing a contact
  const handleEdit = (contact) => {
    setIsEditing(contact.id);
    setEditTitle(contact.title);
    setEditImage(null); // Reset the image
  };

  // Save edited contact
  const handleSaveEdit = async (contact) => {
    try {
      let imageUrl = contact.imageUrl;
      if (editImage) {
        // If the user uploaded a new image, upload it to Firebase Storage
        const imageRef = ref(storage, `contacts/${editImage.name}`);
        await uploadBytes(imageRef, editImage);
        imageUrl = await getDownloadURL(imageRef);

        // Optionally, delete the old image from Firebase Storage
        if (contact.imageUrl) {
          const oldImageRef = ref(storage, contact.imageUrl);
          await deleteObject(oldImageRef);
        }
      }

      // Update the document in Firestore
      await updateDoc(doc(db, `categories/${categoryId}/contacts`, contact.id), {
        title: editTitle,
        imageUrl,
      });

      setIsEditing(null); // End editing
      fetchContacts();  // Refresh the list
    } catch (error) {
      console.error("Error editing contact: ", error);
    }
  };

  // Add a new contact
  const handleAddContact = async () => {
    try {
      if (!newContactTitle) {
        alert("Contact title is required."); // Optional: Alert if title is empty
        return;
      }

      let imageUrl = null;
      if (newContactImage) {
        const imageRef = ref(storage, `contacts/${newContactImage.name}`);
        await uploadBytes(imageRef, newContactImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Create the contact document
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
          <div key={index} className="video-preview">
            {isEditing === contact.id ? (
              // Editing mode
              <div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Edit title"
                />
                <input
                  type="file"
                  onChange={(e) => setEditImage(e.target.files[0])}
                />
                <button onClick={() => handleSaveEdit(contact)}>Save</button>
                <button onClick={() => setIsEditing(null)}>Cancel</button>
              </div>
            ) : (
              // Display mode
              <div>
                <div className="thumbnail-row" onClick={() => navigate(`/info/${contact.id}`)}>
                  <img className="thumbnail" src={contact.imageUrl || contact.img} alt={contact.title} />
                </div>
                <div className="video-info">
                  <p className="video-title">{contact.title}</p>
                  <div className='video-edit-btn'>
                    <button onClick={() => handleEdit(contact)}><img src={Edit} alt='Edit'></img></button>
                    <button onClick={() => handleDelete(contact.id, contact.imageUrl)}><img src={Delete} alt='delete'></img></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* "Add More" Section */}
        <div className="video-preview">
          {showAddMoreForm ? (
            // Show the form inside the "Add More" box when clicked
            <div>
              <input
                type="text"
                value={newContactTitle}
                onChange={(e) => setNewContactTitle(e.target.value)}
                placeholder="Enter contact title"
              />
              <input
                type="file"
                onChange={(e) => setNewContactImage(e.target.files[0])}
              />
              <button onClick={handleAddContact}>Save</button>
              <button onClick={() => setShowAddMoreForm(false)}>Cancel</button>
            </div>
          ) : (
            // Show the default "Add More" thumbnail and title
            <div onClick={() => setShowAddMoreForm(true)}>
              <div className="thumbnail-row">
                <img className="thumbnail" src={Addmore} alt="addmore" />
              </div>
              <div className="video-info">
                <p className="video-title">Add More</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Contacts;
