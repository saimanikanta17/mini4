import {Link} from 'react-router-dom'

import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      className="not-found-img"
      src="https://res.cloudinary.com/djy2od68c/image/upload/v1673070019/Group_7484_mvminn.png"
      alt="not-found"
    />
    <h1>PAGE NOT FOUND</h1>
    <p>
      we’re sorry, the page you requested could not be found Please go back to
      the homepage
    </p>
    <Link to="/">
      <button type="button" className="home-btn">
        Home
      </button>
    </Link>
  </div>
)

export default NotFound
