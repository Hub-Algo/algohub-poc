import { useOutletContext } from 'react-router-dom'
import { AppState } from '../../App'

function useAppContext() {
  return useOutletContext<AppState>()
}

export default useAppContext
