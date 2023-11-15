const teamInfo = [
  {
    name: 'Lorenzo Ferrari',
    role: 'CEO',
    description: '1x Founder. Background in business planning, management & corporate finance.',
    link: 'https://www.linkedin.com/in/lorenzo-ferrari-669409125/',
  },
  {
    name: 'Giorgos Kourtellos',
    role: 'CTO',
    description: 'Former IBM & CTO of Decentralized Vision. 8 years blockchain experience',
    link: 'https://www.linkedin.com/in/giorgoskourtellos/',
  },
  {
    name: 'Arthur Rabelo',
    role: 'Frontend developer',
    description: 'ex Algogator 🐊',
    link: 'https://www.linkedin.com/in/arthur-rabelo-front-end/',
  },
  {
    name: 'Gülçin Uras',
    role: 'Frontend developer',
    description: 'Tinyman',
    link: 'https://www.linkedin.com/in/gulcin-uras/',
  },
  {
    name: 'Wolf Burnus',
    role: 'Product manager',
    description: 'ex Pera Wallet',
    link: 'https://www.linkedin.com/in/wolf-oc-burnus/',
  },
]

const TeamList = () => {
  const teamListRenderer = teamInfo.map((teamMember) => (
    <a href={teamMember.link} target="_blank" rel="noopener noreferrer">
      <div className=" bg-gray-900 gap-3 p-6 colspan-1 flex rounded-md flex-col text-center justify-start hover:scale-101 transition-all h-64">
        <h3 className="text-gray-100 font-bold text-xl">{teamMember.name}</h3>
        <h4 className="text-gray-300 font-bold">{teamMember.role}</h4>
        <p className="text-gray-300 leading-tight">{teamMember.description}</p>
        <a className="text-blue-300 underline hover:text-blue-500" href={teamMember.link}>
          Linkedin
        </a>
      </div>
    </a>
  ))

  return (
    <div className="bg-gray-950 py-6">
      <h2 className="ml-6 text-3xl text-gray-100 font-bold">Team members</h2>
      <div className="bg-gray-950 gap-10 w-full p-6 flex-wrap justify-between grid grid-cols-2 md:grid-cols-4">{teamListRenderer}</div>
    </div>
  )
}

export default TeamList
