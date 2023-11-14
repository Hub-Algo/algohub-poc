import React, { useState } from 'react'
import { BiQuestionMark } from 'react-icons/bi'
import LabelTooltip from '../LabelTooltip'

const CreatedAssetsSelect = ({ options, handleSetAssetId }) => {
  console.log('options', options)

  const [selectedAsset, setSelectedAsset] = useState<number>()

  const handleAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('event', event)
    const value = event.target.value

    const assetId = Number(value.split(' - ')[1])

    console.log('change selected asset', assetId)

    setSelectedAsset(assetId)
    handleSetAssetId(selectedAsset)
  }

  const optionsRenderer = options.map((option) => (
    <option key={option.index} className="flex justify-between">
      {option.params['unit-name'].toUpperCase()} - {option.index}
    </option>
  ))

  return (
    <div className="w-full">
      <select onChange={handleAssetChange} className="select select-primary border-px border-gray-800 w-full bg-gray-950 text-gray-100">
        <option disabled>Select an asset</option>
        {optionsRenderer}
      </select>
    </div>
  )
}

export default CreatedAssetsSelect
