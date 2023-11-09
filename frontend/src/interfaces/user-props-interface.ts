import { UserInterface } from '../interfaces/userInterface'

export interface UserPropsInterface {
  userData: UserInterface | undefined
  resetUserData: () => void
}
