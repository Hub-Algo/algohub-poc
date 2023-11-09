const images = [
  'https://pbs.twimg.com/profile_banners/973713781627830272/1683779199/600x200',
  'https://pbs.twimg.com/profile_banners/1503154439909167115/1660838512/600x200',
  'https://pbs.twimg.com/profile_banners/973713781627830272/1683779199/600x200',
  'https://pbs.twimg.com/profile_banners/1503154439909167115/1660838512/600x200',
]

const Carousel = () => {
  const renderedImages = images.map((image, index) => {
    return (
      <div key={index} id={`item${index}`} className="carousel-item w-full">
        <img src={image} className="w-full" />
      </div>
    )
  })

  return (
    <div className="w-full md:w-96 h-64">
      <div className="carousel w-full md:w-96 h-36 md:h-64 rounded-md">{renderedImages}</div>
      <div className="flex  w-full py-2 gap-6 justify-center">
        <a href="#item1" className="btn btn-xs">
          1
        </a>
        <a href="#item2" className="btn btn-xs">
          2
        </a>
        <a href="#item3" className="btn btn-xs">
          3
        </a>
        <a href="#item4" className="btn btn-xs">
          4
        </a>
      </div>
    </div>
  )
}

export default Carousel
