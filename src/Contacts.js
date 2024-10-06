import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar';
import Father from './imageFolder/Father.png'
import Mother from './imageFolder/Mother.png'
import Brother from './imageFolder/Brother.png'
import Sister from './imageFolder/Sister.png'
import ElderSister from './imageFolder/ElderSister.png'
import GrandFather from './imageFolder/GrandFather.png'
import GrandMother from './imageFolder/GrandMother.png'




const Contacts = () => {
   const contentItems =[
    { title: 'Father', img:Father, alt:'father'},
    { title: 'Mother', img:Mother, alt:'mother'},
    { title: 'Brother', img:Brother, alt:'brother'},
    { title: 'Elder Sister', img:ElderSister, alt:'eldersister'},
    { title: 'Sister', img:Sister, alt:'sister'},
    { title: 'Grand Father', img:GrandFather, alt:'grandfather'},
    { title: 'Grand Mother', img:GrandMother, alt:'Grandmother'},
   ];

   

   return (
    <div>
    <Header/>
    <Sidebar/>
    <main>
      <section className='video-grid'>
        {contentItems.map((item,index) =>(
          <div key={index} className='video-preview'>
              <div className='thumbnail-row'>
                <img className='thumbnail' src={item.img} alt={item.alt}/>
              </div>
              <div className='video-info'>
                <p className='video-title'>{item.title}</p>
              </div>
          </div>
        ))}
      </section>
    </main>
    </div>
   )
}

export default Contacts