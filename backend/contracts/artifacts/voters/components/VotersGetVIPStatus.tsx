/* eslint-disable no-console */
import { ReactNode, useState } from 'react';
import { useWallet } from '@txnlab/use-wallet';
import { VotersClient } from '../../contracts/VotersClient';

/* Example usage
<VotersGetVIPStatus
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getVIPStatus"
  typedClient={typedClient}
  account={account}
/>
*/
type VotersGetVIPStatusArgs = Dao['methods']['getVIPStatus(address)bool']['argsObj'];

type Props = {
  buttonClass: string;
  buttonLoadingNode?: ReactNode;
  buttonNode: ReactNode;
  typedClient: VotersClient;
  account: VotersGetVIPStatusArgs['account'];
};

const VotersGetVIPStatus = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { activeAddress, signer } = useWallet();
  const sender = { signer, addr: activeAddress! };

  const callMethod = async () => {
    setLoading(true);
    console.log(`Calling getVIPStatus`);
    await props.typedClient.getVIPStatus(
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

export default VotersGetVIPStatus;
