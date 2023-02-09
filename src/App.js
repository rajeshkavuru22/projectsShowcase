import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiResponsesList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class App extends Component {
  state = {
    projectsData: [],
    category: categoriesList[0].id,
    apiResponseStatus: apiResponsesList.initial,
  }

  componentDidMount() {
    this.getProjectsData(categoriesList[0].id)
  }

  getProjectsData = async value => {
    this.setState({apiResponseStatus: apiResponsesList.inProgress})
    const url = `https://apis.ccbp.in/ps/projects?category=${value}`
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const modifiedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        apiResponseStatus: apiResponsesList.success,
        projectsData: modifiedData,
      })
    } else {
      this.setState({apiResponseStatus: apiResponsesList.failure})
    }
  }

  onChangeCategoryOption = event => {
    const Value = event.target.value
    this.setState({category: Value})
    console.log(Value)
    this.getProjectsData(Value)
  }

  onRetry = () => {
    const {category} = this.state
    this.getProjectsData(category)
  }

  renderLoader = () => (
    <div className="content-container" data-testid="loader">
      <Loader height={50} width={50} color="#328af2" type="ThreeDots" />
    </div>
  )

  render() {
    const {projectsData, apiResponseStatus, category} = this.state

    const projectDetails = project => {
      const {id, name, imageUrl} = project
      return (
        <li className="item" key={id}>
          <img src={imageUrl} alt={name} className="project-img" />
          <p className="name">{name}</p>
        </li>
      )
    }

    const renderSuccessView = () => (
      <ul className="list">{projectsData.map(each => projectDetails(each))}</ul>
    )

    const renderFailureView = () => (
      <div className="content-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
          alt="failure view"
          className="failure-img"
        />
        <h1 className="heading">Oops! Something Went Wrong</h1>
        <p className="description">
          We cannot seem to find the page you are looking for.
        </p>
        <button className="button" type="button" onClick={this.onRetry}>
          Retry
        </button>
      </div>
    )

    const renderData = () => {
      switch (apiResponseStatus) {
        case apiResponsesList.inProgress:
          return this.renderLoader()
        case apiResponsesList.success:
          return renderSuccessView()
        case apiResponsesList.failure:
          return renderFailureView()
        default:
          return null
      }
    }

    return (
      <div className="bg-container">
        <nav className="navbar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>
        <div className="body-container">
          <select
            className="select"
            onChange={this.onChangeCategoryOption}
            value={category}
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {renderData()}
        </div>
      </div>
    )
  }
}

export default App
