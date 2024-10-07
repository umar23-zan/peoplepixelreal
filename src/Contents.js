import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Import Firestore db
import Addmore from './icons/group_add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg'; // Add More icon
import './contents.css'

const Contents = () => {
  const navigate = useNavigate();
  const [contentItems, setContentItems] = useState([]);

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const fetchedItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Add 'Add More' category manually at the end
    const addMoreCategory = {
      title: "Add More",
      img: Addmore,
      alt: "addmore",
      route: "/addmore",
    };

    setContentItems([...fetchedItems, addMoreCategory]);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleClick = (route) => {
    navigate(route);
  };

  return (
    <main>
      <section className="video-grid">
        {contentItems.map((item, index) => (
          <div key={index} className="video-preview">
            <div className="thumbnail-row" onClick={() => handleClick(item.route || "/")}>
              <img className="thumbnail" src={item.imageUrl || item.img} alt={item.title} />
            </div>
            <div className="video-info">
              <p className="video-title">{item.title}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Contents;
