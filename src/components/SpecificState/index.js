import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import Footer from '../Footer'

import StateCase from '../StateCase'

import TopDistricts from '../TopDistricts'

import './index.css'

const statesList = [
  {
    state_code: 'AN',
    state_name: 'Andaman and Nicobar Islands',
  },
  {
    state_code: 'AP',
    state_name: 'Andhra Pradesh',
  },
  {
    state_code: 'AR',
    state_name: 'Arunachal Pradesh',
  },
  {
    state_code: 'AS',
    state_name: 'Assam',
  },
  {
    state_code: 'BR',
    state_name: 'Bihar',
  },
  {
    state_code: 'CH',
    state_name: 'Chandigarh',
  },
  {
    state_code: 'CT',
    state_name: 'Chhattisgarh',
  },
  {
    state_code: 'DN',
    state_name: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  {
    state_code: 'DL',
    state_name: 'Delhi',
  },
  {
    state_code: 'GA',
    state_name: 'Goa',
  },
  {
    state_code: 'GJ',
    state_name: 'Gujarat',
  },
  {
    state_code: 'HR',
    state_name: 'Haryana',
  },
  {
    state_code: 'HP',
    state_name: 'Himachal Pradesh',
  },
  {
    state_code: 'JK',
    state_name: 'Jammu and Kashmir',
  },
  {
    state_code: 'JH',
    state_name: 'Jharkhand',
  },
  {
    state_code: 'KA',
    state_name: 'Karnataka',
  },
  {
    state_code: 'KL',
    state_name: 'Kerala',
  },
  {
    state_code: 'LA',
    state_name: 'Ladakh',
  },
  {
    state_code: 'LD',
    state_name: 'Lakshadweep',
  },
  {
    state_code: 'MH',
    state_name: 'Maharashtra',
  },
  {
    state_code: 'MP',
    state_name: 'Madhya Pradesh',
  },
  {
    state_code: 'MN',
    state_name: 'Manipur',
  },
  {
    state_code: 'ML',
    state_name: 'Meghalaya',
  },
  {
    state_code: 'MZ',
    state_name: 'Mizoram',
  },
  {
    state_code: 'NL',
    state_name: 'Nagaland',
  },
  {
    state_code: 'OR',
    state_name: 'Odisha',
  },
  {
    state_code: 'PY',
    state_name: 'Puducherry',
  },
  {
    state_code: 'PB',
    state_name: 'Punjab',
  },
  {
    state_code: 'RJ',
    state_name: 'Rajasthan',
  },
  {
    state_code: 'SK',
    state_name: 'Sikkim',
  },
  {
    state_code: 'TN',
    state_name: 'Tamil Nadu',
  },
  {
    state_code: 'TG',
    state_name: 'Telangana',
  },
  {
    state_code: 'TR',
    state_name: 'Tripura',
  },
  {
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
  },
  {
    state_code: 'UT',
    state_name: 'Uttarakhand',
  },
  {
    state_code: 'WB',
    state_name: 'West Bengal',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SpecificState extends Component {
  state = {
    stateDetails: {},
    districtsDetails: [],
    caseType: 'confirmed',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getStateDetails()
  }

  getFormattedData = (eachDistrict, districts) => {
    const districtName = eachDistrict
    let {confirmed, deceased, recovered} = districts[eachDistrict].total

    if (confirmed === undefined) {
      confirmed = 0
    }
    if (deceased === undefined) {
      deceased = 0
    }
    if (recovered === undefined) {
      recovered = 0
    }

    const active = confirmed - (recovered + deceased)

    return {
      districtName,
      confirmed,
      deceased,
      recovered,
      active,
    }
  }

  getTimeLineDetails = (lastTen, dates) => {
    const resultList = []
    lastTen.forEach(keyDate => {
      if (dates[keyDate]) {
        const {total} = dates[keyDate]
        const confirmed = total.confirmed ? total.confirmed : 0
        const deceased = total.deceased ? total.deceased : 0
        const recovered = total.recovered ? total.recovered : 0
        const tested = total.tested ? total.tested : 0
        resultList.push({
          date: keyDate,
          confirmed,
          deceased,
          recovered,
          tested,
          active: confirmed - (deceased + recovered),
        })
      }
    })
    return resultList
  }

  getStateDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {caseType} = this.state
    const {match} = this.props
    const {params} = match
    const {stateCode} = params

    const apiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(apiUrl)
    const fetchedData = await response.json()

    const url = 'https://apis.ccbp.in/covid19-timelines-data'
    const responseTime = await fetch(url)
    const fetchedDataTime = await responseTime.json()

    const {districts} = fetchedData[stateCode]
    const districtsNames = Object.keys(districts)
    const districtsDetails = districtsNames.map(eachDistrict =>
      this.getFormattedData(eachDistrict, districts),
    )
    districtsDetails.sort((a, b) => b[caseType] - a[caseType])

    const lastUpdated = fetchedData[stateCode].meta.last_updated
    const {dates} = fetchedDataTime[stateCode]
    const datesArray = Object.keys(dates)
    datesArray.reverse()
    const lastTen = datesArray.slice(0, 11)
    console.log(lastTen)
    console.log(dates)
    const timeLineDetails = this.getTimeLineDetails(lastTen, dates)
    console.log(timeLineDetails)

    const stateName = statesList.find(state => state.state_code === stateCode)
      .state_name
    const stateStats = fetchedData[stateCode].total
    const {confirmed, deceased, recovered, tested} = stateStats
    const stateDetails = {
      stateCode,
      stateName,
      confirmed,
      deceased,
      recovered,
      active: confirmed - (recovered + deceased),
      tested,
      lastUpdated,
    }
    this.setState({
      stateDetails,
      districtsDetails,
      apiStatus: apiStatusConstants.success,
    })
  }

  changeCaseType = caseType => {
    const {districtsDetails} = this.state
    districtsDetails.sort((a, b) => b[caseType] - a[caseType])
    this.setState({caseType, districtsDetails})
  }

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#007Bff" height="50" width="50" />
    </div>
  )

  renderStateDetailsView = () => {
    const {stateDetails, districtsDetails, caseType} = this.state
    const {stateName, tested} = stateDetails

    return (
      <>
        <div className="state-details">
          <div>
            <div className="state-name">
              <h1>{stateName}</h1>
            </div>
          </div>
          <div className="tested-card">
            <p>Tested</p>
            <p>{tested}</p>
          </div>
        </div>
        <StateCase
          stateDetails={stateDetails}
          changeCaseType={this.changeCaseType}
        />
        <h1 className={`district-name ${caseType}`}>Top Districts</h1>
        <ul className="district-cases">
          {districtsDetails.map(eachDistrict => (
            <TopDistricts
              eachDistrict={eachDistrict}
              key={eachDistrict.districtName}
              caseType={caseType}
            />
          ))}
        </ul>
        <Footer />
      </>
    )
  }

  renderStateDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderStateDetailsView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <Header />
        <div className="specific-state-container">
          {this.renderStateDetails()}
        </div>
      </div>
    )
  }
}

export default SpecificState
