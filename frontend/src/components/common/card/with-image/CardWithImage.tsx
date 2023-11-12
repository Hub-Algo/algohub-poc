import { generatePath, useNavigate } from 'react-router-dom'
import routes from '../../../../core/routes'

interface CardWithImageProps {
  imageProps: {
    alt: string
    src: string
  }
  children: React.ReactNode
  campaign_id: string
}

function CardWithImage({ imageProps, children, campaign_id }: CardWithImageProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(generatePath(routes.PROJECT_DETAIL.FULL_PATH, { campaignId: campaign_id }))}
      className="shadow-xl bg-transparent lg:w-1/5 border-2 border-transparent rounded-md hover:border-orange-500 transition-all hover:scale-105 cursor-pointer"
    >
      <div className="rounded-b-none h-32 rounded-md bg-orange-500 p-1">
        <img src={imageProps.src} alt={imageProps.alt} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      </div>
      <div className="card-body bg-gray-800 px-3 py-3 rounded-t-none rounded-md text-gray-100">{children}</div>
    </div>
  )
}

export default CardWithImage
