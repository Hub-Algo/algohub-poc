import { Fragment, useState } from 'react'
import {
  useCampaignApplicationDispatchContext,
  useCampaignApplicationStateContext,
} from '../../../../../pages/campaign-application/CampaignApplication.context'
import {
  CampaignApplicationFormData,
  CampaignApplicationFormView,
} from '../../../../../pages/campaign-application/CampaignApplication.types'
import PageContainer from '../../../../PageContainer'
import { CAMPAIGN_APPLICATION_FORM_STATES } from './CampaignApplicationForm.constants'
import CampaignApplicationFormCompanyRegistrationView from './view/company-registration/CampaignApplicationFormCompanyRegistrationView'
import CampaignApplicationFormContactInfoView from './view/contact-info/CampaignApplicationFormContactInfoView'
import CampaignApplicationFormFundRaisingGoal from './view/fund-raising-goal/CampaignApplicationFormFundRaisingGoal'
import CampaignApplicationFormProductDocumentation from './view/product-documentation/CampaignApplicationFormProductDocumentation'
import CampaignApplicationFormProductOverview from './view/product-overview/CampaignApplicationFormProductOverview'
import CampaignApplicatioFormTeamInfoView from './view/team-info/CampaignApplicationFormTeamInfoView'

function CampaignApplicationForm() {
  const { formData } = useCampaignApplicationStateContext()
  const dispatch = useCampaignApplicationDispatchContext()
  const [view, setView] = useState<CampaignApplicationFormView>(CampaignApplicationFormView.ContactInfo)

  return <PageContainer customClassName={'w-full min-h-screen bg-gray-900'}>{renderSection()}</PageContainer>

  function renderSection() {
    switch (view) {
      case CampaignApplicationFormView.ContactInfo:
        return (
          <CampaignApplicationFormContactInfoView
            onClickNextButton={handleModifyApplicationForm}
            savedState={formData[CampaignApplicationFormView.ContactInfo]}
          />
        )
      case CampaignApplicationFormView.TeamInfo:
        return (
          <CampaignApplicatioFormTeamInfoView
            onClickNextButton={handleModifyApplicationForm}
            onClickPrevButton={handleGoBack}
            savedState={formData[CampaignApplicationFormView.TeamInfo]}
          />
        )
      case CampaignApplicationFormView.CompanyRegistrationInfo:
        return (
          <CampaignApplicationFormCompanyRegistrationView
            onClickNextButton={handleModifyApplicationForm}
            onClickPrevButton={handleGoBack}
            savedState={formData[CampaignApplicationFormView.CompanyRegistrationInfo]}
          />
        )
      case CampaignApplicationFormView.ProductOverview:
        return (
          <CampaignApplicationFormProductOverview
            onClickNextButton={handleModifyApplicationForm}
            onClickPrevButton={handleGoBack}
            savedState={formData[CampaignApplicationFormView.ProductOverview]}
          />
        )
      case CampaignApplicationFormView.ProductDocumentation:
        return (
          <CampaignApplicationFormProductDocumentation
            onClickNextButton={handleModifyApplicationForm}
            onClickPrevButton={handleGoBack}
            savedState={formData[CampaignApplicationFormView.ProductDocumentation]}
          />
        )
      case CampaignApplicationFormView.FundraisingGoal:
        return (
          <CampaignApplicationFormFundRaisingGoal
            onSubmitForm={handleModifyApplicationForm}
            onClickPrevButton={handleGoBack}
            savedState={formData[CampaignApplicationFormView.FundraisingGoal]}
          />
        )
      default:
        return <Fragment />
    }
  }

  function handleGoBack(view: CampaignApplicationFormView) {
    setView(view)
  }

  function handleModifyApplicationForm(data: CampaignApplicationFormData) {
    dispatch({ type: 'SET_FORM_DATA', formData: data })

    const currentViewIndex = CAMPAIGN_APPLICATION_FORM_STATES.findIndex((state) => state === data.type)

    if (currentViewIndex < CAMPAIGN_APPLICATION_FORM_STATES.length - 1) {
      const nextView = CAMPAIGN_APPLICATION_FORM_STATES[currentViewIndex + 1]

      setView(nextView)
    }

    if (currentViewIndex === CAMPAIGN_APPLICATION_FORM_STATES.length - 1) {
      dispatch({ type: 'SET_VIEW', view: 'confirmation' })
    }
  }
}

export default CampaignApplicationForm
