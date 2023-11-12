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
import algod from '../../../core/algosdk/AlgodManager'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { useWallet } from '@txnlab/use-wallet'
import AlgohubMasterGetAllCampaignApps from '../../algohub-master-pre-generated/AlgohubMasterGetAllCampaignApps'
import { AlgohubMasterClient } from '../../../contracts/AlgohubMaster'
import AlgohubMasterCreateCampaign from '../../algohub-master-pre-generated/AlgohubMasterCreateCampaign'
import AlgohubMasterCreateApplication from '../../algohub-master-pre-generated/AlgohubMasterCreateApplication'

function CampaignApplicationForm() {
  const { activeAddress, signer } = useWallet()
  const appDetails = {
    resolveBy: 'creatorAndName',
    sender: { signer, addr: activeAddress } as TransactionSignerAccount,
    creatorAddress: activeAddress,
    findExistingUsing: algod.indexer,
  } as AppDetails

  const algohubClient = new AlgohubMasterClient(appDetails, algod.client)

  const [view, setView] = useState<CampaignApplicationFormView>(CampaignApplicationFormView.FundraisingGoal)
  const [formData, setFormData] = useState({})
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [shouldDisplayConfirmationPage, setShouldDisplayConfirmationPage] = useState(false)

  return <PageContainer customClassName={'w-screen min-h-screen bg-green-300'}>{renderView()}</PageContainer>

  function renderView() {
    let content = <Fragment />

    if (shouldDisplayConfirmationPage) {
      content = hasSubmitted ? (
        <div className={'flex flex-col items-center justify-center text-green-600 font-semibold mt-32 gap-8'}>
          <p>{'Your campaign application has been submitted!'}</p>

          <AlgohubMasterGetAllCampaignApps onSuccess={(res) => console.log(res)} typedClient={algohubClient}>
            {'Get all apps'}
          </AlgohubMasterGetAllCampaignApps>
          <Link className={'btn btn-success'} to={routes.BASE}>
            {'Go back to main page'}
          </Link>
        </div>
      ) : (
        <div className={'flex flex-col items-center justify-center text-green-600 font-semibold mt-32 gap-8'}>
          <h2>{'Confirm your campaign application!'}</h2>

          <AlgohubMasterCreateApplication
            buttonClass="btn m-2"
            buttonLoadingNode={<span className="loading loading-spinner" />}
            buttonNode="Call createApplication"
            typedClient={algohubClient}
            algoToVoteRatio={1}
            vipVoteWeight={1}
            votingPeriod={86400}
          />

          {activeAddress && (
            /*  Object.keys(formData).length === 6 && */ <AlgohubMasterCreateCampaign
              typedClient={algohubClient}
              votersAsa={68000392}
              price={1000}
              maxBuyCap={formData[CampaignApplicationFormView.FundraisingGoal]?.maxAmount}
              softCap={formData[CampaignApplicationFormView.FundraisingGoal]?.maxAmount}
              hardCap={formData[CampaignApplicationFormView.FundraisingGoal]?.minAmount}
              duration={86400}
              metadataUrl={''}
              idoAsa={formData[CampaignApplicationFormView.ProductDocumentation]?.assetId ?? 29468419}
              buyAsa={formData[CampaignApplicationFormView.ProductDocumentation]?.assetId ?? 29468419}
              adminAccount={activeAddress}
              onSuccess={() => setHasSubmitted(true)}
            >
              {'Submit application'}
            </AlgohubMasterCreateCampaign>
          )}
        </div>
      )
    } else if (view) {
      content = renderSection()
    }

    return content
  }

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
      setShouldDisplayConfirmationPage(true)
    }
  }
}

export default CampaignApplicationForm
