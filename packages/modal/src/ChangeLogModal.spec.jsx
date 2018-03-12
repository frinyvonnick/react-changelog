/* eslint-disable no-use-before-define */
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { readFileSync } from 'fs'
import path from 'path'
import ReactModal from 'react-modal'
import ChangeLogModalContainer from './ChangeLogModal.container'
import ChangeLogModal from './ChangeLogModal'

jest.mock('react-modal', () => {
  const actual = require.requireActual('react-modal')
  actual.setAppElement = jest.fn()
  return actual
})

Enzyme.configure({ adapter: new Adapter() })

global.fetch = jest.fn()
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
}

describe('ChangeLogModalContainer', () => {
  let component
  const changelog = 'Some feature'
  const url = 'http://some-url.com'

  beforeEach(() => {
    component = mount(<ChangeLogModalContainer />)
    global.fetch.mockReset(() => ({ text: () => 'Some text' }))
  })

  it('should passed changelog directly if provided', () => {
    component.setProps({ changelog })

    expect(component.find(ChangeLogModal).prop('changelog')).toEqual(changelog)
  })

  it('should passed changelog directly if provided even if url is provided', () => {
    component.setProps({ changelog, url })

    expect(global.fetch).not.toHaveBeenCalled()
    expect(component.find(ChangeLogModal).prop('changelog')).toEqual(changelog)
  })

  it('should fetch changelog if url is provided and changelog isn\'t', () => {
    component.setProps({ url })

    expect(global.fetch).toHaveBeenCalledWith(url)
  })

  it('should fetch changelog before mounting if url is provided at instanciation', () => {
    component = mount(<ChangeLogModalContainer url={url} />)

    expect(global.fetch).toHaveBeenCalledWith(url)
  })

  it('should refetch if url changes', () => {
    component = mount(<ChangeLogModalContainer url={url} />)

    component.setProps({ url: 'http://some-other-url.com' })

    expect(global.fetch).toHaveBeenCalledTimes(2)
  })
})

describe('ChangeLogModal', () => {
  let component
  let props

  beforeEach(() => {
    component = mount(<ChangeLogModal {...props} />)
  })

  it('should close when user click on close button', () => {
    component.find('.header > button').simulate('click')

    expect(component.find('.header').exists()).toBe(false)
  })

  it('should set app element in react-modal if appElement prop have been provided', () => {
    // Disable console error from react-modal
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})
    component = mount(<ChangeLogModal appElement="#root" />)

    expect(ReactModal.setAppElement).toHaveBeenCalledWith('#root')
  })

  it('should set prop ariaHideApp to false if appElement isn\'t provided', () => {
    expect(component.find({ ariaHideHidden: false }).exists()).toBe(false)
  })

  it('should set prop ariaHideApp to true if appElement is provided', () => {
    expect(component.find({ ariaHideHidden: false }).exists()).toBe(false)
  })

  it('should display without error', () => {
    expect(component).toBeTruthy()
  })

  it('should display changelog when passed as props', () => {
    component.setProps({ changelog: getChangelog('basic') })

    expect(component.contains('Some brand new feature')).toBe(true)
  })

  it('should handle front-matter meta data and display version', () => {
    component.setProps({ changelog: getChangelog('multiple') })

    expect(component.contains('Version 3.0.1')).toBe(true)
    expect(component.contains('Version 3.0.2')).toBe(true)
  })

  it('should group features by version', () => {
    component.setProps({ changelog: getChangelog('unordered') })

    expect(component.find({ version: '3.0.1' }).prop('features')).toHaveLength(2)
    expect(component.find({ version: '3.0.2' }).prop('features')).toHaveLength(1)
  })

  it('should order groups by version', () => {
    component.setProps({ changelog: getChangelog('unordered') })

    expect(component.find('VersionGroup').at(0).prop('version')).toEqual('3.0.1')
    expect(component.find('VersionGroup').at(1).prop('version')).toEqual('3.0.2')
  })

  it('should filter features by major version provided as props if no version was found in localstorage', () => {
    component.setProps({ version: '3.0.2', changelog: getChangelog('filter') })

    expect(component.find('VersionGroup').length).toEqual(2)
  })

  it('should store version provided as props in localstorage', () => {
    component.setProps({ version: '3.0.1', changelog: getChangelog('filter') })

    expect(localStorage.setItem).toHaveBeenCalledWith('changelog-version', '3.0.1')
  })
  it('should store version provided as props in localstorage on update', () => {
    component.setProps({ version: '3.0.1', changelog: getChangelog('filter') })

    expect(localStorage.setItem).toHaveBeenCalledWith('changelog-version', '3.0.1')

    component.setProps({ version: '3.0.2', changelog: getChangelog('filter') })

    expect(localStorage.setItem).toHaveBeenCalledWith('changelog-version', '3.0.2')
  })

  it('should filter with version stored in localstorage if found', () => {
    localStorage.getItem.mockImplementation(() => '3.0.1')
    component.setProps({ version: '3.0.2', changelog: getChangelog('filter') })

    expect(component.find('VersionGroup').length).toEqual(1)
  })
})

function getChangelog(filename) {
  return readFileSync(path.join(__dirname, `../../storybook/stories/markdowns/${filename}.md`)).toString()
}

