import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Father from './imageFolder/Father.png';
import Mother from './imageFolder/Mother.png';
import Brother from './imageFolder/Brother.png';
import Sister from './imageFolder/Sister.png';
import ElderSister from './imageFolder/ElderSister.png';
import GrandFather from './imageFolder/GrandFather.png';
import GrandMother from './imageFolder/GrandMother.png';

const Contacts = () => {
  const navigate = useNavigate();  // Hook to navigate to other pages

  const contentItems = [
    { title: 'Father', img: Father, alt: 'father', path: '/father' },
    { title: 'Mother', img: Mother, alt: 'mother' },
    { title: 'Brother', img: Brother, alt: 'brother' },
    { title: 'Elder Sister', img: ElderSister, alt: 'eldersister' },
    { title: 'Sister', img: Sister, alt: 'sister' },
    { title: 'Grand Father', img: GrandFather, alt: 'grandfather' },
    { title: 'Grand Mother', img: GrandMother, alt: 'grandmother' },
  ];

  const handleRedirect = (path) => {
    if (path) {
      navigate(path);  // Redirect to the provided path
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <main>
        <section className='video-grid'>
          {contentItems.map((item, index) => (
            <div 
              key={index} 
              className='video-preview' 
              onClick={() => handleRedirect(item.path)}
              style={{ cursor: item.path ? 'pointer' : 'default' }}  // Show pointer cursor for clickable items
            >
              <div className='thumbnail-row'>
                <img className='thumbnail' src={item.img} alt={item.alt} />
              </div>
              <div className='video-info'>
                <p className='video-title'>{item.title}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Contacts;
