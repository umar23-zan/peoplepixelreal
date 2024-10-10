import './contents.css';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import Addmore from './icons/group_add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';

const Contents = () => {
  const navigate = useNavigate();
  const [contentItems, setContentItems] = useState([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [showAddMoreForm, setShowAddMoreForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);  // Track the category being edited

  // Fetch categories from Firestore
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContentItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add or Edit category
  const handleSaveCategory = async () => {
    try {
      if (!newCategoryTitle) {
        alert("Category title is required.");
        return;
      }

      let imageUrl = null;
      if (newCategoryImage) {
        const imageRef = ref(storage, `categories/${newCategoryImage.name}`);
        await uploadBytes(imageRef, newCategoryImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      const categoryRef = doc(db, "categories", editingCategoryId || newCategoryTitle);
      await setDoc(categoryRef, {
        title: newCategoryTitle,
        imageUrl: imageUrl || contentItems.find(item => item.id === editingCategoryId)?.imageUrl,
      });

      setNewCategoryTitle('');
      setNewCategoryImage(null);
      setShowAddMoreForm(false);
      setEditMode(false);
      setEditingCategoryId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category: ", error);
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteDoc(doc(db, "categories", categoryId));
      fetchCategories();  // Refresh the list
    } catch (error) {
      console.error("Error deleting category: ", error);
    }
  };

  // Populate form for editing
  const handleEditCategory = (category) => {
    setEditMode(true);
    setEditingCategoryId(category.id);
    setNewCategoryTitle(category.title);
    setShowAddMoreForm(true);  // Show the form for editing
  };

  return (
    <main>
      <section className="video-grid">
        {contentItems.map((item, index) => (
          <div key={index} className="video-preview">
            {editMode && editingCategoryId === item.id ? (
              // Render edit form inside the video preview
              <div className="form-container">
                <input className='edit-input'
                  type="text"
                  value={newCategoryTitle}
                  onChange={(e) => setNewCategoryTitle(e.target.value)}
                  placeholder="Enter category title"
                />
                <input
                  type="file"
                  onChange={(e) => setNewCategoryImage(e.target.files[0])}
                />
                <button onClick={handleSaveCategory}>Update</button>
                <button onClick={() => {
                  setShowAddMoreForm(false);
                  setEditMode(false);
                  setNewCategoryTitle('');
                  setNewCategoryImage(null);
                }}>
                  Cancel
                </button>
              </div>
            ) : (
              // Display category details when not editing
              <>
                <img
                  className="thumbnail"
                  src={item.imageUrl}
                  alt={item.title}
                  onClick={() => navigate(`/contacts/${item.id}`)}
                />
                <p className="video-title">{item.title}</p>
                <div className="actions">
                  <button onClick={() => handleEditCategory(item)}>Edit</button>
                  <button onClick={() => handleDeleteCategory(item.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Add More Form inside the Add More block */}
        <div className="video-preview">
          {showAddMoreForm && !editMode ? (
            // Render add form when clicked on Add More
            <div className="form-container">
              <input className='form-input'
                type="text"
                value={newCategoryTitle}
                onChange={(e) => setNewCategoryTitle(e.target.value)}
                placeholder="Enter category title"
              />
              <input
                type="file"
                onChange={(e) => setNewCategoryImage(e.target.files[0])}
              />
              <button onClick={handleSaveCategory}>Save</button>
              <button onClick={() => {
                setShowAddMoreForm(false);
                setNewCategoryTitle('');
                setNewCategoryImage(null);
              }}>
                Cancel
              </button>
            </div>
          ) : (
            // Show Add More button when form is not open
            <div onClick={() => setShowAddMoreForm(true)}>
              <img className="thumbnail-add" src={Addmore} alt="Add More" />
              <p className="video-title">Add More</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Contents;
