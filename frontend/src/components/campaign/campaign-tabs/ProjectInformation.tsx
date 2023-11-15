import { ellipseAddress } from '../../../core/util/wallet/ellipseAddress'
import { AssetInfoInterface } from '../../../interfaces/AssetInfoInterface'
import { CampaignInterface } from '../../../interfaces/campaign-interface'
import { FaDiscord, FaSquareXTwitter, FaTelegram, FaGithub, FaLink } from 'react-icons/fa6'
interface ProjectInformationPropsInterface {
  campaign: CampaignInterface
  assetInfo: AssetInfoInterface
}

const ProjectInformation = ({ campaign, assetInfo }: ProjectInformationPropsInterface) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end gap-6">
        <h4 className="text-xl font-bold text-gray-100 font-oswald">Project name:</h4>
        <h3 className="text-xl font-oswald text-gray-100">{campaign.record.companyRegistrationInfo.registeredCompanyName}</h3>
      </div>
      <div className="flex items-end gap-6">
        <h4 className="text-xl font-bold text-gray-100 font-oswald">Asset id:</h4>
        <a href={`https://testnet.algoexplorer.io/asset/${campaign.record.productDocumentation.assetId}`}>
          <h3 className="text-xl font-oswald text-blue-500 border-b border-blue-500 hover:text-blue-600 hover:border-blue-600">
            {campaign.record.productDocumentation.assetId} - {assetInfo?.params.name}
          </h3>
        </a>
      </div>

      <div className="flex items-end gap-6">
        <h4 className="text-xl font-bold text-gray-100 font-oswald">Creator address:</h4>
        <a href={`https://testnet.algoexplorer.io/address/${assetInfo?.params.creator}`}>
          <h3 className="text-xl font-oswald text-blue-500 border-b border-blue-500 hover:text-blue-600 hover:border-blue-600">
            {ellipseAddress(assetInfo?.params.creator)}
          </h3>
        </a>
      </div>

      <div className="flex items-end gap-6">
        <h4 className="text-xl font-bold text-gray-100 font-oswald">Founder:</h4>
        <h3 className="text-xl font-oswald text-gray-100">
          {campaign.record.contactInfo.name} {campaign.record.contactInfo.surname} - {campaign.record.contactInfo.role}
        </h3>
      </div>

      <div className="flex items-end gap-6">
        <h4 className="text-xl font-bold text-gray-100 font-oswald">Country:</h4>
        <h3 className="text-xl font-oswald text-gray-100">{campaign.record.companyRegistrationInfo.countryOfRegistration}</h3>
      </div>

      <div className="flex items-end gap-6">
        <h4 className="text-xl font-bold text-gray-100 font-oswald">Number of employees:</h4>
        <h3 className="text-xl font-oswald text-gray-100">{campaign.record.teamInfo.employeeNumber}</h3>
      </div>

      <div className="flex items-center gap-6">
        <h4 className="text-xl font-bold text-gray-100 font-oswald">Project socials:</h4>
        <ul className="text-gray-100 text-xl flex gap-4">
          <a href={campaign.record.productOverview.discordServer}>
            <li className="hover:text-blue-500 hover:border-blue-600 border-b border-blue-500 pb-1">
              <FaDiscord />
            </li>
          </a>
          <a href={`https://twitter.com/${campaign.record.productOverview.xAccount}`}>
            <li className="hover:text-blue-500 hover:border-blue-600 border-b border-blue-500 pb-1">
              <FaSquareXTwitter />
            </li>
          </a>
          <a href={campaign.record.productOverview.telegram}>
            <li className="hover:text-blue-500 hover:border-blue-600 border-b border-blue-500 pb-1">
              <FaTelegram />
            </li>
          </a>
          <a href={campaign.record.productOverview.github}>
            <li className="hover:text-blue-500 hover:border-blue-600 border-b border-blue-500 pb-1">
              <FaGithub />
            </li>
          </a>
        </ul>
      </div>

      <div className="flex items-end gap-6 text-gray-100">
        <a
          className="flex items-center gap-2 text-blue-500 border-b border-blue-500 hover:text-blue-600 hover:border-blue-600"
          href={`https://testnet.algoexplorer.io/address/${assetInfo?.params.creator}`}
        >
          <h4 className="text-xl font-bold font-oswald">Whitepaper</h4>
          <FaLink />
        </a>
      </div>
    </div>
  )
}

export default ProjectInformation
