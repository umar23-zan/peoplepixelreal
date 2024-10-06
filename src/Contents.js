import React from 'react'
import './contents.css';
import Family from './icons/diversity_1_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg'
import Friends from './icons/diversity_3_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import Others from './icons/groups_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import Addmore from './icons/group_add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
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