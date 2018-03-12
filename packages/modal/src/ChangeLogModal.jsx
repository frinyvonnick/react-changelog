import React, { Component, Fragment } from 'react'
import { string, arrayOf, shape } from 'prop-types'
import ReactModal from 'react-modal'
import Markdown from 'react-markdown'
import fm from 'front-matter'
import { chunk, groupBy, map, isString } from 'lodash'
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
    if (this.props.version) {
      localStorage.setItem('changelog-version', this.props.version)
    }
  }

  componentDidUpdate() {
    if (this.props.version) {
      localStorage.setItem('changelog-version', this.props.version)
    }
  }

  formatMarkdown = (rawMarkdown) => {
    const delimiter = '---'
    if (!rawMarkdown || !rawMarkdown.includes(delimiter)) return rawMarkdown
    const parts = chunk(rawMarkdown.split(delimiter).splice(1), 2).map(([metadata, body]) => `${delimiter}${metadata}${delimiter}${body}`)

    const fmFeatures = parts.map(fm)

    return groupBy(
      fmFeatures
        .filter((f) => {
          if (!this.props.version) return true

          const storedVersion = localStorage.getItem('changelog-version')
          const hasStoredVersion = Boolean(storedVersion)
          const majorVersion = `${this.props.version.split('.')[0]}.0.0`

          const compare = baseVersion => versionToCompare => cmp(baseVersion, versionToCompare)
          const compareToFeature = compare(f.attributes.version)
          const isSuperiorToFeature = versionToCompare => compareToFeature(versionToCompare) > 0

          const isSuperiorToMajorVersion = isSuperiorToFeature(majorVersion)
          const isInferiorOrEqualToProvidedVersion = compareToFeature(this.props.version) <= 0

          if (
            !hasStoredVersion &&
            isSuperiorToMajorVersion &&
            isInferiorOrEqualToProvidedVersion
          ) return true

          if (
            hasStoredVersion &&
            isSuperiorToFeature(storedVersion) &&
            isInferiorOrEqualToProvidedVersion
          ) return true

          return false
        })
        .sort((a, b) => cmp(a.attributes.version, b.attributes.version)),
      f => f.attributes.version,
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
