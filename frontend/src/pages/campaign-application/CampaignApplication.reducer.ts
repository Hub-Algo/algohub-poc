import { CampaignApplicationData, CampaignApplicationReducerAction, CampaignApplicationState } from './CampaignApplication.types'

function campaignApplicationReducer(state: CampaignApplicationState, action: CampaignApplicationReducerAction): CampaignApplicationState {
  let newState = { ...state }

  switch (action.type) {
    case 'SET_FORM_DATA': {
      const { type: formView, ...rest } = action.formData

      newState = { ...state, formData: { ...state.formData, [formView]: rest } as CampaignApplicationData }

      break
    }

    case 'SET_VIEW': {
      newState = { ...state, view: action.view }
      break
    }

    case 'SET_CAMPAIGN_ID': {
      newState = { ...state, campaignId: action.campaignId }
      break
    }

    default:
      break
  }

  return newState
}

export default campaignApplicationReducer
