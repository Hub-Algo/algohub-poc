export interface CategoryBadgePropsInterface {
  marketCategory: string
  size: 'sm' | 'md' | 'lg'
}

const CategoryBadge = ({ marketCategory, size }: CategoryBadgePropsInterface) => {
  const getMarketCategoryBadgeColor = () => {
    switch (marketCategory) {
      case 'consumer':
        return 'bg-yellow-500 text-gray-100'
      case 'defi':
        return 'bg-gulçin-pink text-gray-100'
      case 'gamefi':
        return 'bg-green-500 text-gray-100'
      case 'impact':
        return 'bg-purple-500 text-gray-100'
      case 'infrastructure':
        return 'bg-cyan-500 text-gray-100'
      case 'interoperability':
        return 'bg-emerald-500 text-gray-100'
      case 'nft':
        return 'bg-blue-500 text-gray-100'
      case 'other':
        return 'bg-rose-500 text-gray-100'

      default:
        return 'bg-orange-300'
    }
  }

  const getBadgeSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm'
      case 'md':
        return 'text-md'
      case 'lg':
        return 'text-lg'
    }
  }

  return (
    <div className={`${getMarketCategoryBadgeColor()} ${getBadgeSize()} rounded-full text-center w-auto px-2 font-bold `}>
      {marketCategory}
    </div>
  )
}

export default CategoryBadge
