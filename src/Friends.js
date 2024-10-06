import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Rahman from './imageFolder/Rahman.png'
import Abdul from './imageFolder/Abdul.png'
import Rita from './imageFolder/rita.png'
import Riyaz from './imageFolder/Riyaz.png'

const Friends = () => {
  const contentItems =[
    { title: 'Rahman', img:Rahman, alt:'rahman'},
    { title: 'Abdul', img:Abdul, alt:'abdul'},
    { title: 'Rita', img:Rita, alt:'rita'},
    { title: 'Riyaz', img:Riyaz, alt:'riyaz'},
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

export default Friends