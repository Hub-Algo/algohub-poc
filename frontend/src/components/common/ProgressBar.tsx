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
        <p className="text-xs">{progress.toFixed(2)}%</p>
      </div>
    </div>
  )
}

export default ProgressBar
