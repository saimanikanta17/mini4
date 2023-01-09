import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'

import './index.css'

const State = props => {
  const {stateDate} = props
  const {
    stateName,
    confirmedCases,
    deceasedCases,
    recoveredCases,
    population,
  } = stateDate
  const activeCases = confirmedCases - (recoveredCases + deceasedCases)
  return (
    <li className="state-cases">
      <div className="states-card">
        <p>{stateName}</p>
      </div>
      <div className={`confirmed-text ${'count-card'}`}>
        <p>{confirmedCases}</p>
      </div>
      <div className={`active-text ${'count-card'}`}>
        <p>{activeCases}</p>
      </div>
      <div className={`recovered-text ${'count-card'}`}>
        <p>{recoveredCases}</p>
      </div>
      <div className={`deceased-text ${'count-card'}`}>
        <p>{deceasedCases}</p>
      </div>
      <div className={`population-text ${'count-card'}`}>
        <p>{population}</p>
      </div>
    </li>
  )
}

const StateStats = props => {
  const {stateWiseData, sortingAsc, sortingDesc} = props
  const clickSortingAsc = () => {
    sortingAsc()
  }
  const clickSortingDesc = () => {
    sortingDesc()
  }

  return (
    <div className="state-wise-cases">
      <div className="state-cases-heading">
        <div className="states-card">
          <p>States/UT</p>
          <button type="button" className="btn" onClick={clickSortingAsc}>
            <FcGenericSortingAsc size="25px" />
          </button>
          <button type="button" className="btn" onClick={clickSortingDesc}>
            <FcGenericSortingDesc size="25px" />
          </button>
        </div>
        <div className="count-card">
          <p>Confirmed</p>
        </div>
        <div className="count-card">
          <p>Active</p>
        </div>
        <div className="count-card">
          <p>Recovered</p>
        </div>
        <div className="count-card">
          <p>Deceased</p>
        </div>
        <div className="count-card">
          <p>Population</p>
        </div>
      </div>
      <ul className="stats-details">
        {stateWiseData.map(stateDate => (
          <State key={stateDate.stateCode} stateDate={stateDate} />
        ))}
      </ul>
    </div>
  )
}

export default StateStats
