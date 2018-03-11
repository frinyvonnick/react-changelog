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
    version: string,
    appElement: string,
    url: string,
    title: string,
    changelog: string,
  }

  static defaultProps = {
    version: undefined,
    appElement: undefined,
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
      this.fetchChangelog(this.props.url)
    }
  }

  componentDidMount() {
    this.openModal()
    if (this.props.appElement) {
      ReactModal.setAppElement(this.props.appElement)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.url && this.props.url !== nextProps.url) {
      this.fetchChangelog(nextProps.url)
    }
  }

  fetchChangelog = async (url) => {
    const res = await fetch(url)
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
    const formattedChangelog = this.formatMarkdown(changelog || this.state.changelog)

    return (
      <ReactModal
        isOpen={this.state.open}
        ariaHideApp={!!this.props.appElement || false}
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
            source={formattedChangelog}
            escapeHtml={false}
          />
        </div>
      </ReactModal>
    )
  }
}
