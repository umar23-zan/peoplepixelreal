import React, { useState } from "react";
import { storage, db } from "./firebase"; // Import firebase storage and db
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import './Addmore.css'
import Header from './Header'
import Sidebar from './Sidebar'

const Addmore = () => {

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSave = async () => {
    if (title && image) {
      setLoading(true);
      try {
        // Upload image to Firebase Storage
        const imageRef = ref(storage, `categories/${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);

        // Save title and image URL to Firestore
        await addDoc(collection(db, "categories"), {
          title,
          imageUrl,
        });

        setLoading(false);
        setTitle("");
        setImage(null);
        alert("Category added successfully!");
      } catch (error) {
        console.error("Error adding category: ", error);
        setLoading(false);
      }
    } else {
      alert("Please provide both title and image.");
    }
  };
  return (
    <div>
      <Header/>
      <Sidebar/>
      <main>
        <div className="Addmore-section">
          <h2>Add New Category</h2>
          <div>
          <input
            type="text"
            placeholder="Enter title"
            className="input-text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input className="input-file" type="file"    onChange=   {handleFileChange} />
          <button className="input-save" onClick=  {handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Addmore