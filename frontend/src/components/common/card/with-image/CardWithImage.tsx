interface CardWithImageProps {
  imageProps: {
    alt: string
    src: string
  }
  children: React.ReactNode
}

function CardWithImage({ imageProps, children }: CardWithImageProps) {
  return (
    <div className="card w-96 shadow-xl bg-transparent">
      <figure className={'rounded-2xl'}>
        <img src={imageProps.src} alt={imageProps.alt} />
      </figure>

      <div className="card-body bg-card-bg px-6 py-5 border border-yellow-200 rounded-2xl">{children}</div>
    </div>
  )
}

export default CardWithImage
