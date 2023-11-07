/* eslint-disable no-console */
import { ReactNode, useState } from 'react';
import { useWallet } from '@txnlab/use-wallet';
import { VotersClient } from '../../contracts/VotersClient';

/* Example usage
<VotersBootstrap
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call bootstrap"
  typedClient={typedClient}
  voteAsaTotal={voteAsaTotal}
/>
*/
type VotersBootstrapArgs = Dao['methods']['bootstrap(uint64)uint64']['argsObj'];

type Props = {
  buttonClass: string;
  buttonLoadingNode?: ReactNode;
  buttonNode: ReactNode;
  typedClient: VotersClient;
  voteAsaTotal: VotersBootstrapArgs['voteAsaTotal'];
};

const VotersBootstrap = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { activeAddress, signer } = useWallet();
  const sender = { signer, addr: activeAddress! };

  const callMethod = async () => {
    setLoading(true);
    console.log(`Calling bootstrap`);
    await props.typedClient.bootstrap(
      {
        voteAsaTotal: props.voteAsaTotal,
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

export default VotersBootstrap;