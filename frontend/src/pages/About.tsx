import PageContainer from '../components/PageContainer'
import Breadcrumbs from '../components/common/breadcrumbs/Breadcrumbs'
import TeamList from '../components/team-display/TeamList'

export default function About() {
  return (
    <div className="bg-gray-900">
      <PageContainer>
        <Breadcrumbs pathList={['Home', 'About us']} />
        <div className="text-gray-100 flex flex-col gap-3">
          <h1 className="text-5xl  font-black">About Algohub</h1>
          <p className="text-xl text-gray-400">
            AlgoHub is an early-stage organization building a decentralized “one-stop-shop" platform for Algorand related fundraising and
            collaboration services.
          </p>
          <ul className="flex flex-col gap-3 mt-3 py-3 border-t-2 border-b-2">
            <li className="hover:scale-101 transition-all hover:bg-gray-950 p-3 rounded-md select-none">
              <h3 className="text-2xl font-bold text-orange-500">Launchpad:</h3>
              <p className="text-gray-400 text-xl">
                A fundraising platform for enterprise projects building on Algorand. Features a decentralized diligence process, post-raise
                accountability mechanisms and has no native token requirements for participation, unlike most similar solutions.
              </p>
            </li>

            <li className="hover:scale-101 transition-all hover:bg-gray-950 p-3 rounded-md select-none">
              <h3 className="text-2xl font-bold text-orange-500">Crowdfunding:</h3>
              <p className="text-gray-400 text-xl">
                A Kickstarter-like platform for consumer projects seeking community support and funding. Features post-raise accountability
                mechanisms.
              </p>
            </li>

            <li className="hover:scale-101 transition-all hover:bg-gray-950 p-3 rounded-md select-none">
              <h3 className="text-2xl font-bold text-orange-500">Talent Labs:</h3>
              <p className="text-gray-400 text-xl">
                A decentralized freelancing marketplace dedicated to Algorand. An UpWork- like platform for finding either talent or jobs,
                without a centralized intermediary.
              </p>
            </li>

            <li className="hover:scale-101 transition-all hover:bg-gray-950 p-3 rounded-md select-none">
              <h3 className="text-2xl font-bold text-orange-500">AlgoCrypt:</h3>
              <p className="text-gray-400 text-xl">
                Time-locked token vaults and multi-sig treasuries. Basically, UniCrypt and Gnosis Vaults made available for the Algorand
                ecosystem.
              </p>
            </li>
          </ul>
          <div className="mb-6">
            <h3 className="text-3xl">Present & Future</h3>
            <p className="text-gray-400 text-lg">
              AlgoHub is presently an Early-Stage Organization competing in the Build-a-Bull Algorand Hackaton. For the scope of this
              competition, we have built the MVP of our Launchpad platform. Future efforts in order will be: I) AlgoCrypt, II) Launchpad v2,
              III) Crowdfunding, IV) Talent Labs. We estimate completion of the above within 2 years
            </p>
          </div>
        </div>
      </PageContainer>
      <TeamList />
    </div>
  )
}
