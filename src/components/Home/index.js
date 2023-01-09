import {Component} from 'react'

import {BsSearch} from 'react-icons/bs'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import Footer from '../Footer'

import CountryStats from '../CountryStats'

import StateStats from '../StateStats'

import SearchResults from '../SearchResults'

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

class Home extends Component {
  state = {
    stateWiseData: [],
    apiStatus: apiStatusConstants.initial,
    searchState: '',
  }

  componentDidMount() {
    this.getStateWiseData()
  }

  getFormattedData = (element, data) => {
    const code = element.state_code
    return {
      stateCode: code,
      stateName: element.state_name,
      confirmedCases: data[code].total.confirmed,
      deceasedCases: data[code].total.deceased,
      recoveredCases: data[code].total.recovered,
      population: data[code].meta.population,
    }
  }

  getStateWiseData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(apiUrl)
    const fetchedData = await response.json()
    const stateWiseData = statesList.map(state =>
      this.getFormattedData(state, fetchedData),
    )

    stateWiseData.sort((a, b) => a.stateName - b.stateName)
    this.setState({
      apiStatus: apiStatusConstants.success,
      stateWiseData,
    })
  }

  sortingAsc = () => {
    const {stateWiseData} = this.state
    stateWiseData.sort((a, b) =>
      a.stateName.toLowerCase() < b.stateName.toLowerCase() ? -1 : 1,
    )
    this.setState({stateWiseData})
  }

  sortingDesc = () => {
    const {stateWiseData} = this.state
    stateWiseData.sort((a, b) =>
      a.stateName.toLowerCase() > b.stateName.toLowerCase() ? -1 : 1,
    )
    this.setState({stateWiseData})
  }

  changeSearch = event => {
    this.setState({searchState: event.target.value})
  }

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#007Bff" height="50" width="50" />
    </div>
  )

  renderStatsView = () => {
    const {stateWiseData, searchState} = this.state
    const showResults = searchState !== ''
    const searchResults = statesList.filter(eachSearch =>
      eachSearch.state_name.toLowerCase().includes(searchState.toLowerCase()),
    )

    return (
      <div className="home-card">
        <div className="search-card">
          <BsSearch size="20px" fill="#94a3b8" />
          <input
            type="search"
            placeholder="Enter the State"
            value={searchState}
            className="search-input"
            onChange={this.changeSearch}
          />
        </div>
        {showResults ? (
          <ul className="search-list">
            {searchResults.map(state => (
              <SearchResults key={state.state_code} state={state} />
            ))}
          </ul>
        ) : (
          <>
            <CountryStats stateWiseData={stateWiseData} />
            <StateStats
              stateWiseData={stateWiseData}
              sortingAsc={this.sortingAsc}
              sortingDesc={this.sortingDesc}
            />
            <Footer />
          </>
        )}
      </div>
    )
  }

  renderStats = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderStatsView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <Header />
        {this.renderStats()}
      </div>
    )
  }
}

export default Home
