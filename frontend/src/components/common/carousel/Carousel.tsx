const images = [
  'https://pbs.twimg.com/profile_banners/973713781627830272/1683779199/600x200',
  'https://pbs.twimg.com/profile_banners/1503154439909167115/1660838512/600x200',
  'https://pbs.twimg.com/profile_banners/1414619378323267585/1699203622/1500x500',
  'https://pbs.twimg.com/profile_banners/1441430126303055873/1680594213/1500x500',
]

const Carousel = () => {
  const renderedImages = images.map((image, index) => {
    return (
      <div key={index} id={`item${index}`} className="carousel-item w-full">
        <img src={image} className="w-full object-cover" />
      </div>
    )
  })

  const renderedThumbnails = images.map((image, index) => {
    return (
      <a href={`#item${index}`}>
        <div key={index} id={`item${index}`} className="">
          <img src={image} className="w-16 h-16 rounded-md object-cover" />
        </div>
      </a>
    )
  })

  return (
    <div className="col-span-5">
      <div className="carousel rounded-md h-80 border-5 border-orange-500">{renderedImages}</div>
      <div className="flex w-full py-2 gap-6 justify-center">{renderedThumbnails}</div>
    </div>
  )
}

export default Carousel
