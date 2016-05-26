import React from 'react'
import {Link} from 'react-router'
import 'whatwg-fetch'

export default class Home extends React.Component {
  constructor () {
    super()

    this.scroll.bind(this)

    this.state = {
      posts: [],
      loaded: false
    }

    this.loading = false
  }

  getPosts () {
    if (this.loading || this.state.loaded) return

    this.loading = true

    window.fetch('/data/get/blog', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: this.state.posts.length,
        limit: 5
      })
    })
    .then((response) => {
      return response.json()
    })
    .then((posts) => {
      this.loading = false
      this.setState({
        posts: this.state.posts.concat(posts),
        loaded: posts.length < 5
      })
    })
  }

  componentDidMount () {
    let bannerHeight = this.refs.banner.offsetHeight

    this.refs.text.style.marginTop =
      (window.innerHeight - bannerHeight) / 2 - this.refs.text.offsetHeight

    window.onscroll = (e) => {
      let scrolled = document.body.scrollTop - bannerHeight + 10
      let opacity = Math.min(1, scrolled / 60)
      this.refs.topBar.style.color = `rgba(255, 255, 255, ${opacity})`

      opacity = 1 - Math.min(1, scrolled / 200)
      this.refs.downButton.style.opacity = opacity

      opacity = 1 - Math.min(1, (document.body.scrollTop - 100) / 100)
      document.querySelectorAll('.link-container > a').forEach((item) => {
        item.style.opacity = opacity
      })

      document.querySelectorAll('.blog-item').forEach((item, i) => {
        let visible =
          document.body.scrollTop + window.innerHeight - 60 > item.offsetTop

        item.classList.toggle('show', visible)

        if (visible && document.querySelectorAll('.blog-item').length - 1 === i) {
          this.getPosts()
        }
      })
    }

    this.getPosts()
  }

  componentWillUnmount () {
    window.onscroll = null
  }

  scroll () {
    function scrollTo (element, target, duration) {
      target = Math.round(target)
      duration = Math.round(duration)

      if (duration < 0) return Promise.reject('bad duration')

      if (duration === 0) {
        element.scrollTop = target
        return Promise.resolve()
      }

      let startTime = Date.now()
      let endTime = startTime + duration
      let startTop = element.scrollTop
      let distance = target - startTop

      function smoothStep (start, end, point) {
        if (point <= start) return 0
        if (point >= end) return 1
        let x = (point - start) / (end - start)
        return x * x * (3 - 2 * x)
      }

      return new Promise(function (resolve, reject) {
        let previousTop = element.scrollTop

        function scrollFrame () {
          if (element.scrollTop !== previousTop) {
            reject('interrupted')
            return
          }

          let now = Date.now()
          let point = smoothStep(startTime, endTime, now)
          let frameTop = Math.round(startTop + (distance * point))
          element.scrollTop = frameTop

          if (now >= endTime ||
             (element.scrollTop === previousTop &&
              element.scrollTop !== frameTop)) {
            resolve()
            return
          }

          previousTop = element.scrollTop

          setTimeout(scrollFrame, 0)
        }
        setTimeout(scrollFrame, 0)
      })
    }

    scrollTo(
      document.body,
      document.querySelector('.blog-item').offsetTop - 140,
      1200
    )
  }

  render () {
    return (
      <div>
        <div ref='topBar' className='top-bar'>
          <Link to='/projects'>projects</Link>
          <Link to='/lab'>lab</Link>
          <Link to='/about'>about</Link>
        </div>
        <div ref='banner' className='home-banner'>
          <div className='link-container'>
            <Link to='/projects' className='fa fa-code' />
            <Link to='/lab' className='fa fa-flask' />
            <Link to='/about' className='fa fa-user' />
          </div>
        </div>
        <div className='site-content'>
          <div ref='text' className='home-text'>
            text goes here
            <div
              ref='downButton'
              onClick={this.scroll}
              className='fa fa-angle-down' />
          </div>
          {this.state.posts.map((post, i) => {
            return (
              <div
                style={{marginTop: i ? 'default' : window.innerHeight - 300}}
                className='blog-item'
                key={i}>
                <div>{post.title}</div>
                <div>{post.body}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
