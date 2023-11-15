interface ProgressBarPropsInterface {
  hard_goal: number
  invested_amount: number
}

const ProgressBar = ({ hard_goal, invested_amount }: ProgressBarPropsInterface) => {
  const progress = (invested_amount / hard_goal) * 100

  return (
    <div className="w-full">
      <div className="flex flex-col items-end">
        <progress
          className={`progress ${
            progress > 90 ? 'progress-success' : progress < 90 && progress > 50 ? 'progress-warning' : 'progress-error'
          } w-full bg-gray-950`}
          value={progress}
          max="100"
        ></progress>
        <div className="flex justify-between w-full">
          <p className="text-xs">{invested_amount} USDC</p>
          <p className="text-xs text-end">{progress.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
