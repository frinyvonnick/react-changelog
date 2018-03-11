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
    title: string,
    changelog: string,
  }

  static defaultProps = {
    version: undefined,
    appElement: undefined,
    title: 'New things',
    changelog: undefined,
  }

  state = {
    open: false,
  }

  componentDidMount() {
    this.openModal()
    if (this.props.appElement) {
      ReactModal.setAppElement(this.props.appElement)
    }
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
    const formattedChangelog = this.formatMarkdown(changelog)

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
