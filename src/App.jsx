import { useEffect, useState } from 'react'
import headerBanner from './assets/header-banner.png'

const apiKey = import.meta.env.VITE_GIPHY_API_KEY;

function App() {

  const [images, setImages] = useState([]);
  
  useEffect(() => {
    const getImages = async () => {
      const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=schitts&limit=10`).catch(err => console.log(err));
      const dataRes = await res.json();

      const addProps = dataRes.data.map((imgObj) => ({...imgObj, clicked:false}));
      setImages(addProps);
    }
    
    getImages();
  }, []);

  return (
    <>
        <div className="header">
          <img src={headerBanner} />
        </div>
        <Game imageList={images} />
    </>
  )
}


function Game({ imageList }){
  const [images, setImages] = useState(imageList);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);


  useEffect(() => {
    if (imageList.length > 0) {
      setImages(imageList);
    }
  }, [imageList]);

  useEffect(() => {
    if (score > best) setBest(score);
  }, [score]);

  const shuffleArray = (array) => {
    const shuffledArr = [];
    const usedIndexes = [];

    while (shuffledArr.length < array.length) {
      const randomIndex = Math.floor(Math.random() * array.length);
      if (!usedIndexes.includes(randomIndex)) {
        shuffledArr.push(array[randomIndex]);
        usedIndexes.push(randomIndex);
      }
    }

    return shuffledArr
  }

  const handleImageClick = (e) => {
    const getImageClicked = images.filter((image) => (e.target.id === image.id))[0];
    let updatedImageList = [];
    let shuffledImageList = [];

    if (getImageClicked.clicked) {
      //losing conditions
      setScore(0);
      updatedImageList = images.map((image) => ({...image, clicked:false}))
      shuffledImageList = shuffleArray(updatedImageList);
      setImages(shuffledImageList);
    } else {
      setScore(score + 1);
      updatedImageList = images.map((image) => (e.target.id === image.id ? { ...image, clicked: true } : image));
      shuffledImageList = shuffleArray(updatedImageList);
      setImages(shuffledImageList);
    }
  }

  return (
    <>
      <div className="directions">        
        <p>Get points by clicking on an image but don't click on any more than once!</p>
      </div>

      <div className="score">
        <p><span style={{ fontWeight: "bold" }}>Score:</span> {score}</p>
        <p><span style={{ fontWeight: "bold" }}>Best Score:</span> {best}</p>
      </div>

      <ul className="image-list">
        {images.map((image) => (<li> <img onClick={handleImageClick} id={image.id} src={image.images.original.url}></img> </li>))}
      </ul>
    </>
  )
}

export default App
