import { AlgodTokenHeader, Algodv2, Indexer, IndexerTokenHeader } from 'algosdk'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../util/network/getAlgoClientConfigs'

class AlgodManager {
  client: Algodv2
  indexer: Indexer

  constructor() {
    const { token, server, port } = getAlgodConfigFromViteEnvironment()
    const { token: iToken, server: iServer, port: iPort } = getIndexerConfigFromViteEnvironment()

    this.client = new Algodv2(token as AlgodTokenHeader, server, port)
    this.indexer = new Indexer(iToken as IndexerTokenHeader, iServer, iPort)
  }
}

const algod = new AlgodManager()

export default algod
