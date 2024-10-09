import './contents.css';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import Addmore from './icons/group_add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg'; 

const Contents = () => {
  const navigate = useNavigate();
  const [contentItems, setContentItems] = useState([]);
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

  // Add a new category without creating the nested contacts collection
  const handleAddCategory = async () => {
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

      // Create the category document
      const categoryRef = doc(db, "categories", newCategoryTitle);
      await setDoc(categoryRef, {
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
          <div key={index} className="video-preview" onClick={() =>{
            console.log(`${item.id}`);
            navigate(`/contacts/${item.id}`)}}>
            <img className="thumbnail" src={item.imageUrl} alt={item.title} />
            <p className="video-title">{item.title}</p>
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
        )}
      </section>
    </main>
  );
};

export default Contents;
