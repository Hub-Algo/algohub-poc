/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<CampaignSetVestingSchedule
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call setVestingSchedule"
  typedClient={typedClient}
  vestingPercentages={vestingPercentages}
  vestingDurations={vestingDurations}
/>
*/
type CampaignSetVestingScheduleArgs = Dao['methods']['setVestingSchedule(uint64[],uint64[])void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: CampaignClient
  vestingPercentages: CampaignSetVestingScheduleArgs['vestingPercentages']
  vestingDurations: CampaignSetVestingScheduleArgs['vestingDurations']
}

const CampaignSetVestingSchedule = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling setVestingSchedule`)
    await props.typedClient.setVestingSchedule(
      {
        vestingPercentages: props.vestingPercentages,
        vestingDurations: props.vestingDurations,
      },
      { sender },
    )
    setLoading(false)
  }

  return (
    <button className={props.buttonClass} onClick={callMethod}>
      {loading ? props.buttonLoadingNode || props.buttonNode : props.buttonNode}
    </button>
  )
}

export default CampaignSetVestingSchedule