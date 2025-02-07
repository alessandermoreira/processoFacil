import React from 'react';
import Slider from 'react-slick';

const BackgroundCarousel = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: false,
  };

  const images = [
    "../imgs/home3.png",
    "../imgs/home4.png",
    "../imgs/home5.png",
    // Adicione mais URLs de imagens conforme necessário
  ];

  return (
    <div className="background-carousel">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="slide">
            <img src={image} alt={`slide-${index}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BackgroundCarousel;