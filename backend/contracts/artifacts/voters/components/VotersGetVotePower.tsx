/* eslint-disable no-console */
import { ReactNode, useState } from 'react';
import { useWallet } from '@txnlab/use-wallet';
import { VotersClient } from '../../contracts/VotersClient';

/* Example usage
<VotersGetVotePower
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getVotePower"
  typedClient={typedClient}
  account={account}
/>
*/
type VotersGetVotePowerArgs = Dao['methods']['getVotePower(address)uint64']['argsObj'];

type Props = {
  buttonClass: string;
  buttonLoadingNode?: ReactNode;
  buttonNode: ReactNode;
  typedClient: VotersClient;
  account: VotersGetVotePowerArgs['account'];
};

const VotersGetVotePower = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { activeAddress, signer } = useWallet();
  const sender = { signer, addr: activeAddress! };

  const callMethod = async () => {
    setLoading(true);
    console.log(`Calling getVotePower`);
    await props.typedClient.getVotePower(
      {
        account: props.account,
      },
      { sender }
    );
    setLoading(false);
  };

  return (
    <button className={props.buttonClass} onClick={callMethod}>
      {loading ? props.buttonLoadingNode || props.buttonNode : props.buttonNode}
    </button>
  );
};

export default VotersGetVotePower;
