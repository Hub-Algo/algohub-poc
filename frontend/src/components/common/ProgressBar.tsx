import { convertFromBaseUnits } from '../../core/util/transaction/transactionUtils'
import { AssetInfoInterface } from '../../interfaces/AssetInfoInterface'

interface ProgressBarPropsInterface {
  hard_goal: number
  invested_amount: number
  asset_info: AssetInfoInterface | undefined
}

const ProgressBar = ({ hard_goal, invested_amount, asset_info }: ProgressBarPropsInterface) => {
  const progress = (invested_amount / hard_goal) * 100

  return (
    <div className="w-full">
      <div className="flex flex-col items-end">
        <progress
          className={`progress ${
            progress >= 90 ? 'progress-success' : progress < 90 && progress > 50 ? 'progress-warning' : 'progress-error'
          } w-full bg-gray-950`}
          value={progress}
          max="100"
        ></progress>
        <div className="flex justify-between w-full text-gray-300">
          <p className="text-xs">
            {convertFromBaseUnits(asset_info?.params?.decimals || 0, invested_amount).toLocaleString('en-US')}{' '}
            {asset_info?.params['unit-name']}
          </p>
          <p className="text-xs text-end">{progress.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
