const formatCreationDate = (date: string) => {
  const originalDate = new Date(date)

  const day = originalDate.getDate().toString().padStart(2, '0')
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0')
  const year = originalDate.getFullYear().toString()

  const formattedDate = `${year}-${month}-${day}`

  return formattedDate
}

const formatTimeStamp = (date: number) => {
  const convertedDate = new Date(date * 1000) // Multiply by 1000 to convert seconds to milliseconds

  const day = convertedDate.getDate().toString().padStart(2, '0')
  const month = (convertedDate.getMonth() + 1).toString().padStart(2, '0') // Months are zero-based
  const year = convertedDate.getFullYear()

  const formattedDate = `${day}/${month}/${year}`
  return formattedDate
}

export { formatCreationDate, formatTimeStamp }
