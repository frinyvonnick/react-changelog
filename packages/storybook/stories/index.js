import 'babel-polyfill'
import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { ChangeLogModal } from '@react-changelog/modal'

class LoadData extends React.Component {
  state = {
    data: null
  }

  async componentDidMount() {
    const res = await fetch(this.props.url)
    const data = await res.text()
    this.setState({ data })
  }

  render() {
    return this.props.children(this.state.data)
  }
}

const stories = storiesOf('changelog modal', module)

stories.add('empty', () => (
  <ChangeLogModal appElement="#root" />
))

stories.add('with markdown as prop', () => (
  <LoadData url="/markdowns/basic.md">
    {changelog => (
      <ChangeLogModal
        appElement="#root"
        changelog={changelog}
      />
    )}
  </LoadData>
))

stories.add('with url', () => (
  <ChangeLogModal
    appElement="#root"
    url="/markdowns/basic.md"
  />
))

stories.add('with image', () => (
  <ChangeLogModal
    appElement="#root"
    url="/markdowns/image.md"
  />
))

stories.add('with animated image', () => (
  <ChangeLogModal
    appElement="#root"
    url="/markdowns/animated.md"
  />
))

stories.add('with long text', () => (
  <ChangeLogModal
    appElement="#root"
    url="/markdowns/long.md"
  />
))

stories.add('with multiple feature', () => (
  <ChangeLogModal
    appElement="#root"
    url="/markdowns/multiple.md"
  />
))

stories.add('filtering by version', () => (
  <ChangeLogModal
    appElement="#root"
    version="3.0.1"
    url="/markdowns/multiple.md"
  />
))

stories.add('sorting by version', () => (
  <ChangeLogModal
    appElement="#root"
    url="/markdowns/unordered.md"
  />
))
