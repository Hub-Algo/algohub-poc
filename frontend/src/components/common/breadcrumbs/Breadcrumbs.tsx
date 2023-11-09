const Breadcrumbs = ({ pathList }) => {
  return (
    <div className="text-sm breadcrumbs text-gray-300">
      <ul>
        {pathList.map((path) => (
          <li key={path}>
            <p>{path}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Breadcrumbs
