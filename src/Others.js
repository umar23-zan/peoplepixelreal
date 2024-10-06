import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import HouseKeeper from './imageFolder/HouseKeeper.png'
import Uncle from './imageFolder/Uncle.png'
import Sheik from './imageFolder/Sheik.png'

const Others = () => {
  const contentItems =[
    { title: 'House Keeper', img:HouseKeeper, alt:'housekeeper'},
    { title: 'Uncle', img:Uncle, alt:'uncle'},
    { title: 'Sheik', img:Sheik, alt:'sheik'},
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

export default Others