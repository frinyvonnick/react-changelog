import { Component } from 'react'
import { string, func } from 'prop-types'

export default class LoadData extends Component {
  static propTypes = {
    url: string.isRequired,
    children: func.isRequired,
  }

  state = {
    data: null,
  }

  async componentDidMount() {
    const res = await fetch(this.props.url)
    const data = await res.text()
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ data })
  }

  render() {
    return this.props.children(this.state.data)
  }
}
