import './contents.css'
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase"; // Import Firestore db and Firebase Storage
import Addmore from './icons/group_add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg'; // Add More icon
import Delete from './icons/delete_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import Edit from './icons/person_edit_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';

const Contents = () => {
  const navigate = useNavigate();
  const [contentItems, setContentItems] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [showAddMoreForm, setShowAddMoreForm] = useState(false);

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const fetchedItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setContentItems(fetchedItems);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete a category
  const handleDelete = async (id, imageUrl) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "categories", id));

      // Delete the image from Firebase Storage (optional)
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }

      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error("Error deleting category: ", error);
    }
  };

  // Start editing a category
  const handleEdit = (item) => {
    setIsEditing(item.id);
    setEditTitle(item.title);
    setEditImage(null); // Reset the image
  };

  // Save edited category
  const handleSaveEdit = async (item) => {
    try {
      let imageUrl = item.imageUrl;
      if (editImage) {
        // If the user uploaded a new image, upload it to Firebase Storage
        const imageRef = ref(storage, `categories/${editImage.name}`);
        await uploadBytes(imageRef, editImage);
        imageUrl = await getDownloadURL(imageRef);

        // Optionally, delete the old image from Firebase Storage
        if (item.imageUrl) {
          const oldImageRef = ref(storage, item.imageUrl);
          await deleteObject(oldImageRef);
        }
      }

      // Update the document in Firestore
      await updateDoc(doc(db, "categories", item.id), {
        title: editTitle,
        imageUrl,
      });

      setIsEditing(null); // End editing
      fetchCategories();  // Refresh the list
    } catch (error) {
      console.error("Error editing category: ", error);
    }
  };

  // Add a new category
  const handleAddCategory = async () => {
    try {
      let imageUrl = null;
      if (newCategoryImage) {
        const imageRef = ref(storage, `categories/${newCategoryImage.name}`);
        await uploadBytes(imageRef, newCategoryImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Add the new category to Firestore
      await addDoc(collection(db, "categories"), {
        title: newCategoryTitle,
        imageUrl,
      });

      setNewCategoryTitle('');
      setNewCategoryImage(null);
      setShowAddMoreForm(false);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  return (
    <main>
      <section className="video-grid">
        {contentItems.map((item, index) => (
          <div key={index} className="video-preview">
            {isEditing === item.id ? (
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
                <button onClick={() => handleSaveEdit(item)}>Save</button>
                <button onClick={() => setIsEditing(null)}>Cancel</button>
              </div>
            ) : (
              // Display mode
              <div>
                <div className="thumbnail-row" onClick={() => navigate(item.route || "/Contacts")}>
                  <img className="thumbnail" src={item.imageUrl || item.img} alt={item.title} />
                </div>
                <div className="video-info">
                  <p className="video-title">{item.title}</p>
                  {item.route !== "/addmore" && (
                    <div className='video-edit-btn'>
                      <button onClick={() => handleEdit(item)}><img src={Edit} alt='Edit'></img></button>
                      <button onClick={() => handleDelete(item.id, item.imageUrl)}><img src={Delete} alt='delete'></img></button>
                    </div>
                  )}
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
                value={newCategoryTitle}
                onChange={(e) => setNewCategoryTitle(e.target.value)}
                placeholder="Enter category title"
              />
              <input
                type="file"
                onChange={(e) => setNewCategoryImage(e.target.files[0])}
              />
              <button onClick={handleAddCategory}>Save</button>
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

export default Contents;
