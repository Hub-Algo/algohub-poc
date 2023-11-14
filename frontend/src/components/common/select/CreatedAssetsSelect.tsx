import React, { useState } from 'react'

const CreatedAssetsSelect = ({ options, handleSetAssetId }) => {
  const [selectedAsset, setSelectedAsset] = useState<number>()

  const handleAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    const assetId = Number(value.split(' - ')[1])

    setSelectedAsset(assetId)
    handleSetAssetId(assetId)
  }

  const optionsRenderer = options.map((option) => (
    <option key={option.index} className="flex justify-between">
      {option.params['unit-name'].toUpperCase()} - {option.index}
    </option>
  ))

  return (
    <div className="w-full">
      <select onChange={handleAssetChange} className="select select-primary border-px border-gray-800 w-full bg-gray-950 text-gray-100">
        <option>Select an asset</option>
        {optionsRenderer}
      </select>
    </div>
  )
}

export default CreatedAssetsSelect
