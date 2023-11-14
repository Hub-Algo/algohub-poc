import { BiQuestionMark } from 'react-icons/bi'

interface LabelTooltipPropsInterface {
  labelContent: string
  tooltipText?: string
}

const LabelTooltip = ({ labelContent, tooltipText }: LabelTooltipPropsInterface) => {
  return (
    <div className="flex items-center gap-6 mt-3 mb-1 w-full">
      <label className="label py-0 text-gray-100 font-bold">{labelContent}</label>{' '}
      {tooltipText ? (
        <div className="tooltip tooltip-right" data-tip={tooltipText}>
          <button className="bg-gray-100 rounded-full">
            <BiQuestionMark className="text-gray-950" />
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default LabelTooltip
