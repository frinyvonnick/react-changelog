import 'babel-polyfill'
import React from 'react'
import { storiesOf } from '@storybook/react'
import ChangeLogModal from '@react-changelog/modal'
import LoadData from './LoadData'

const stories = storiesOf('changelog modal', module)

stories.add('empty', () => (
  <ChangeLogModal appElement="#root" />
))

stories.add('with markdown as prop', () => (
  <LoadData url="/markdowns/basic.md">
    {changelog => (
      <ChangeLogModal changelog={changelog} />
    )}
  </LoadData>
))

stories.add('with url', () => (
  <ChangeLogModal url="/markdowns/basic.md" />
))

stories.add('with image', () => (
  <ChangeLogModal url="/markdowns/image.md" />
))

stories.add('with animated image', () => (
  <ChangeLogModal url="/markdowns/animated.md" />
))

stories.add('with long text', () => (
  <ChangeLogModal url="/markdowns/long.md" />
))

stories.add('with multiple feature', () => (
  <ChangeLogModal url="/markdowns/multiple.md" />
))

stories.add('filtering by major version', () => {
  localStorage.removeItem('changelog-version')
  return (
    <ChangeLogModal version="3.0.2" url="/markdowns/filter.md" />
  )
})

stories.add('filtering by stored version', () => {
  localStorage.setItem('changelog-version', '3.0.1')
  return (
    <ChangeLogModal version="3.0.2" url="/markdowns/filter.md" />
  )
})

stories.add('sorting by version', () => (
  <ChangeLogModal url="/markdowns/unordered.md" />
))

stories.add('cheatsheet', () => (
  <ChangeLogModal url="/markdowns/cheatsheet.md" />
))
