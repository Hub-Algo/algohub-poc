const teamInfo = [{ name: 'Arthur Rabelo' }]

const TeamList = () => {
  const teamListRenderer = teamInfo.map((teamMember) => <div>{teamMember.name}</div>)

  return <div className="bg-gray-950">{teamListRenderer}</div>
}

export default TeamList
