import React, { Component, Fragment } from 'react'
import { string, arrayOf, shape } from 'prop-types'
import ReactModal from 'react-modal'
import Markdown from 'react-markdown'
import frontMatterParser from 'front-matter'
import { groupBy, map, isString } from 'lodash'
import { splitMarkdown, hasMarkdownMetaData, versionPredicate, sortBy } from './utils'

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
    this.setStoredVersion(this.props.version)
  }

  componentDidUpdate() {
    this.setStoredVersion(this.props.version)
  }

  setStoredVersion = (version) => {
    if (version) {
      localStorage.setItem('changelog-version', version)
    }
  }

  formatMarkdown = (rawMarkdown) => {
    if (!rawMarkdown || !hasMarkdownMetaData(rawMarkdown)) return rawMarkdown

    const versionPath = 'attributes.version'

    return groupBy(
      splitMarkdown(rawMarkdown)
        .map(frontMatterParser)
        .filter(versionPredicate(this.props.version))
        .sort(sortBy(versionPath)),
      versionPath,
    )
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
          {isString(formattedChangelog) ? (
            <Markdown
              source={formattedChangelog}
              escapeHtml={false}
            />
          ) : map(formattedChangelog, (features, key) => (
            <VersionGroup key={key} version={key} features={features} />
          ))}
        </div>
      </ReactModal>
    )
  }
}

// eslint-disable-next-line no-use-before-define
VersionGroup.propTypes = {
  version: string.isRequired,
  features: arrayOf(shape({
    body: string.isRequired,
  })).isRequired,
}

function VersionGroup({ version, features }) {
  return (
    <Fragment>
      <h3>{`Version ${version}`}</h3>
      <hr />
      <Markdown
        source={map(features, 'body').join('')}
        escapeHtml={false}
      />
    </Fragment>
  )
}
