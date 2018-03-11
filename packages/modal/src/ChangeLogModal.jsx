import React, { Component } from 'react'
import { string } from 'prop-types'
import ReactModal from 'react-modal'
import Markdown from 'react-markdown'
import fm from 'front-matter'
import { chunk, groupBy, map } from 'lodash'
import cmp from 'semver-compare'

import src from './close.png'
import './ChangeLogModal.css'

export default class ChangeLogModal extends Component {
  static propTypes = {
    appElement: string.isRequired,
    version: string.isRequired,
    url: string,
    title: string,
    changelog: string,
  }

  static defaultProps = {
    title: 'New things',
    url: undefined,
    changelog: undefined,
  }

  state = {
    changelog: undefined,
    open: false,
  }

  async componentWillMount() {
    if (this.props.url) {
      this.fetchChangelog()
    }
  }

  componentDidMount() {
    this.openModal()
    ReactModal.setAppElement(this.props.appElement)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url !== nextProps.url) {
      this.fetchChangelog()
    }
  }

  fetchChangelog = async () => {
    const res = await fetch(this.props.url)
    const changelog = await res.text()
    this.setState({ changelog })
  }

  formatMarkdown = (rawMarkdown) => {
    const delimiter = '---'
    if (!rawMarkdown || !rawMarkdown.includes(delimiter)) return rawMarkdown
    const parts = chunk(rawMarkdown.split(delimiter).splice(1), 2).map(([metadata, body]) => `${delimiter}${metadata}${delimiter}${body}`)

    const fmFeatures = parts.map(fm)

    const versionGroups = groupBy(
      fmFeatures
        .filter((f) => {
          if (!this.props.version) return true
          if (cmp(f.attributes.version, this.props.version) > 0) return true
          return false
        })
        .sort((a, b) => cmp(a.attributes.version, b.attributes.version)),
      f => f.attributes.version,
    )

    return map(versionGroups, (group, key) => `
### Version ${key}
<hr>\n
${group.map(feature => feature.body).join('')}
`).join('')
  }

  openModal = () => this.setState({ open: true })

  closeModal = () => this.setState({ open: false })

  render() {
    const { title, changelog } = this.props

    return (
      <ReactModal
        isOpen={this.state.open}
        onRequestClose={this.closeModal}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="header">
          <span>{title}</span>
          <button
            onClick={this.closeModal}
          >
            <span>Close</span>
            <img alt="close icon" src={src} />
          </button>
        </div>
        <div className="content">
          <Markdown
            source={this.formatMarkdown(changelog || this.state.changelog)}
            escapeHtml={false}
          />
        </div>
      </ReactModal>
    )
  }
}
