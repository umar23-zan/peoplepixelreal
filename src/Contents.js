import React from 'react'
import './contents.css';
import Family from './icons/family-svgrepo-com.svg'
import Friends from './icons/friends-talking-svgrepo-com.svg';
import Others from './icons/more-svgrepo-com.svg';
import Addmore from './icons/add-square-svgrepo-com.svg';
import { useNavigate } from "react-router-dom";


const Contents = () => {
  const navigate = useNavigate();
   const contentItems =[
    { title: 'Family', img:Family, alt:'family', route:'/contacts' },
    { title: 'Friends', img:Friends, alt:'friends', route:'/friends' },
    { title: 'Others', img:Others, alt:'others', route:'/others' },
    { title: 'Add More', img:Addmore, alt:'addmore', route:'/addmore' },
   ];

   const handelClick = (route) =>
   {
    navigate(route);
   };

   return (
    <main>
      <section className='video-grid'>
        {contentItems.map((item,index) =>(
          <div key={index} className='video-preview'>
              <div className='thumbnail-row' onClick={()=>handelClick(item.route)}>
                <img className='thumbnail' src={item.img} alt={item.alt}/>
              </div>
              <div className='video-info'>
                <p className='video-title'>{item.title}</p>
              </div>
          </div>
        ))}
      </section>
    </main>
   )
}

export default Contents