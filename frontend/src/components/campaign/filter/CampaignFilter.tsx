import { useState } from 'react'
import categories from '../../../core/categories'

interface campaignFilterProps {
  handleFilterCampaigns: (category: string) => void
}

const CampaignFilter = ({ handleFilterCampaigns }: campaignFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>()

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    handleFilterCampaigns(category)
  }

  const categoriesRenderer = categories.map((category) => (
    <div
      key={category}
      onClick={() => handleCategoryClick(category)}
      className={`border-2 ${
        selectedCategory === category ? 'bg-orange-500 border-orange-500 font-bold' : ''
      } text-gray-200 rounded-full px-2 py-1 text-center hover:bg-orange-300 cursor-pointer hover:text-gray-950 transition-all active:bg-orange-500 `}
    >
      {category}
    </div>
  ))

  return (
    <div className="flex flex-col gap-2 mb-10">
      <h1 className="text-xl font-bold text-gray-100">Filter by category</h1>
      <div className="flex gap-x-3 gap-y-2 flex-wrap">{categoriesRenderer}</div>
    </div>
  )
}

export default CampaignFilter
