import React, { Component } from 'react'
import { string } from 'prop-types'
import ChangeLogModal from './ChangeLogModal'

export default class ChangeLogModalContainer extends Component {
  static propTypes = {
    changelog: string,
    url: string,
  }

  static defaultProps = {
    changelog: undefined,
    url: undefined,
  }

  state = {
    changelog: undefined,
  }

  async componentWillMount() {
    if (!this.props.changelog && this.props.url) {
      this.fetchChangelog(this.props.url)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.changelog && nextProps.url && this.props.url !== nextProps.url) {
      this.fetchChangelog(nextProps.url)
    }
  }

  fetchChangelog = async (url) => {
    const res = await fetch(url)
    const changelog = await res.text()
    this.setState({ changelog })
  }

  render() {
    const { changelog, ...props } = this.props

    return (
      <ChangeLogModal
        changelog={changelog || this.state.changelog}
        {...props}
      />
    )
  }
}
