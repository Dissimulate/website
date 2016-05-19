import React from 'react'
import {render} from 'react-dom'
import {browserHistory, Router, Route, IndexRoute, Link} from 'react-router'
import Home from './components/home'
import Footer from './components/footer'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class App extends React.Component {
  render () {
    return (
      <ReactCSSTransitionGroup
        component='div'
        transitionName='fade'
        transitionAppear={true}
        transitionLeave={true}
        transitionEnterTimeout={600}
        transitionAppearTimeout={600}
        transitionLeaveTimeout={300}>
        {React.cloneElement(this.props.children, {
          key: this.props.location.pathname
        })}
        <Footer />
      </ReactCSSTransitionGroup>
    )
  }
}

class Lab extends React.Component {
  render () {
    return (
      <div className='hidden-frame'>
        123
      </div>
    )
  }
}

class NoMatch extends React.Component {
  render () {
    return (
      <h1>404</h1>
    )
  }
}

render((
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Home} />
      <Route path='/lab' component={Lab} />
    </Route>
    <Route path='*' component={NoMatch} />
  </Router>
  ), document.getElementById('app'))
