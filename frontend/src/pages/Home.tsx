import { useNavigate } from 'react-router-dom'
import Button from '../components/common/button/Button'
import CardWithImage from '../components/common/card/with-image/CardWithImage'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      <section className="relative h-96 md:h-screen bg-gradient-to-l from-orange-800 via-orange-900 to-gray-900 flex flex-col items-center justify-between -z-10">
        <div className="flex w-full items-center h-screen">
          <div className="lg:w-1/2 flex flex-col gap-4 py-10 px-10 items-center text-center lg:text-left lg:items-start">
            <h1 className="text-6xl md:text-8xl font-bold text-white">Algohub</h1>
            <h2 className="text-2xl md:text-4xl text-gray-200 animate-pulse w-full md:w-2/3">
              Conceive great ideas with help from the world
            </h2>
            <div className="flex gap-6">
              <Button buttonColor={'orange'}>{'Create campaign'}</Button>

              <Button buttonType={'outline'} buttonColor={'transparent'}>
                {'View active campaigns'}
              </Button>
            </div>
            <div className="text-gray-300">Built on Algorand</div>
          </div>
        </div>
      </section>
      <section className="bg-gray-900 px-6 py-6">
        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-gray-100">Active campaigns 🔥</h3>
          <div className="flex flex-col md:grid items-center gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid 2xl:grid-cols-4 w-max">
            <CardWithImage imageProps={{ src: 'src/core/images/gunny-tps.png', alt: 'gunny-tps' }}>
              <h2 className={'card-title'}>{'Gunny TPS'}</h2>
              <div className={'mb-8'}>
                <div className={'flex gap-4 w-max'}>
                  <p>{'Start date'}</p> <p>{'02/12/23'}</p>
                </div>

                <div className={'flex gap-4 w-max'}>
                  <p>{'End date'}</p> <p>{'02/01/24'}</p>
                </div>
              </div>

              <Button buttonColor={'accent'} size={'lg'} customClassName={'rounded-2xl'} onClick={() => navigate('/campaign/1')}>
                {'view campaign'}
              </Button>
            </CardWithImage>

            <CardWithImage imageProps={{ src: 'src/core/images/the-recoop.png', alt: 'gunny-tps' }}>
              <h2 className={'card-title'}>{'The Recoop'}</h2>
              <div className={'mb-8'}>
                <div className={'flex gap-4 w-max'}>
                  <p>{'Start date'}</p> <p>{'02/12/23'}</p>
                </div>

                <div className={'flex gap-4 w-max'}>
                  <p>{'End date'}</p> <p>{'02/01/24'}</p>
                </div>
              </div>

              <Button buttonColor={'accent'} size={'lg'} customClassName={'rounded-2xl'} onClick={() => navigate('/campaign/2')}>
                {'view campaign'}
              </Button>
            </CardWithImage>
          </div>
        </div>
      </section>
    </div>
  )
}
