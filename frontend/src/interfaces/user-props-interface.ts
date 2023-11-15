import { PROVIDER_ID } from '@txnlab/use-wallet'
import { UserInterface } from '../interfaces/userInterface'

export interface UserPropsInterface {
  userData: UserInterface | undefined
  resetUserData: () => void
  providerId?: PROVIDER_ID
}
