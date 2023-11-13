import { Fragment, useState } from 'react'
import { CampaignApplicationFormData, CampaignApplicationFormView } from './CampaignApplicationForm.types'
import CampaignApplicationFormContactInfoView from './view/contact-info/CampaignApplicationFormContactInfoView'
import CampaignApplicatioFormTeamInfoView from './view/team-info/CampaignApplicationFormTeamInfoView'
import CampaignApplicationFormCompanyRegistrationView from './view/company-registration/CampaignApplicationFormCompanyRegistrationView'
import { CAMPAIGN_APPLICATION_FORM_STATES } from './CampaignApplicationForm.constants'
import CampaignApplicationFormProductOverview from './view/product-overview/CampaignApplicationFormProductOverview'
import CampaignApplicationFormProductDocumentation from './view/product-documentation/CampaignApplicationFormProductDocumentation'
import CampaignApplicationFormFundRaisingGoal from './view/fund-raising-goal/CampaignApplicationFormFundRaisingGoal'
import { Link } from 'react-router-dom'
import routes from '../../../core/routes'
import PageContainer from '../../PageContainer'

function CampaignApplicationForm() {
  const [view, setView] = useState<CampaignApplicationFormView>(CampaignApplicationFormView.ContactInfo)
  const [formData, setFormData] = useState({})
  const [hasSubmitted, setHasSubmitted] = useState(false)

  return (
    <PageContainer customClassName={'w-screen min-h-screen bg-gray-900'}>
      {hasSubmitted ? (
        <div className={'flex flex-col items-center justify-center text-gray-100 font-semibold mt-32 gap-8'}>
          <p>{'Your campaign application has been submitted!'}</p>

          <Link className={'btn btn-success'} to={routes.BASE}>
            {'Go back to main page'}
          </Link>
        </div>
      ) : (
        renderView()
      )}
    </PageContainer>
  )

  function renderView() {
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
    const { type: formView, ...rest } = data

    setFormData((prev) => {
      return { ...prev, [formView]: { ...rest } }
    })

    const currentViewIndex = CAMPAIGN_APPLICATION_FORM_STATES.findIndex((state) => state === formView)

    if (currentViewIndex < CAMPAIGN_APPLICATION_FORM_STATES.length - 1) {
      const nextView = CAMPAIGN_APPLICATION_FORM_STATES[currentViewIndex + 1]

      setView(nextView)
    }

    if (currentViewIndex === CAMPAIGN_APPLICATION_FORM_STATES.length - 1) {
      setHasSubmitted(true)
    }
  }
}

export default CampaignApplicationForm
