import { createContext, Dispatch, useContext, useReducer } from 'react'
import { CampaignApplicationFormView, CampaignApplicationReducerAction, CampaignApplicationState } from './CampaignApplication.types'
import campaignApplicationReducer from './CampaignApplication.reducer'
import CampaignApplication from './CampaignApplication'

const CampaignApplicationStateContext = createContext<CampaignApplicationState | null>(null)
const CampaignApplicationDispatchContext = createContext<Dispatch<CampaignApplicationReducerAction> | null>(null)

CampaignApplicationStateContext.displayName = 'CampaignApplicationStateContext'
CampaignApplicationDispatchContext.displayName = 'CampaignApplicationDispatchContext'

function useCampaignApplicationStateContext() {
  const context = useContext(CampaignApplicationStateContext)

  if (!context) {
    throw new Error('useCampaignApplicationStateContext must be used within a CampaignApplicationContextProvider')
  }

  return context
}

function useCampaignApplicationDispatchContext() {
  const context = useContext(CampaignApplicationDispatchContext)

  if (!context) {
    throw new Error('useCampaignApplicationDispatchContext must be used within a CampaignApplicationContextProvider')
  }

  return context
}

function CampaignApplicationContextProvider() {
  const [state, dispatch] = useReducer(campaignApplicationReducer, {
    formData: {
      [CampaignApplicationFormView.CompanyRegistrationInfo]: null,
      [CampaignApplicationFormView.TeamInfo]: null,
      [CampaignApplicationFormView.ProductOverview]: null,
      [CampaignApplicationFormView.ProductDocumentation]: null,
      [CampaignApplicationFormView.FundraisingGoal]: null,
      [CampaignApplicationFormView.ContactInfo]: null,
    },
    view: 'form',
    campaignId: null,
  })

  return (
    <CampaignApplicationDispatchContext.Provider value={dispatch}>
      <CampaignApplicationStateContext.Provider value={state}>
        <CampaignApplication />
      </CampaignApplicationStateContext.Provider>
    </CampaignApplicationDispatchContext.Provider>
  )
}

export { CampaignApplicationContextProvider, useCampaignApplicationStateContext, useCampaignApplicationDispatchContext }
