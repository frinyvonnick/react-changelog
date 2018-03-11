/* eslint-disable no-use-before-define */
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { readFileSync } from 'fs'
import path from 'path'
import ChangeLogModalContainer from './ChangeLogModal.container'
import ChangeLogModal from './ChangeLogModal'

Enzyme.configure({ adapter: new Adapter() })

global.fetch = jest.fn()

describe('ChangeLogModalContainer', () => {
  let component
  const changelog = 'Some feature'
  const url = 'http://some-url.com'

  beforeEach(() => {
    component = mount(<ChangeLogModalContainer />)
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
})

describe('ChangeLogModal', () => {
  let component
  let props

  beforeEach(() => {
    component = mount(<ChangeLogModal {...props} />)
  })

  it('should display without error', () => {
    expect(component).toBeTruthy()
  })

  it('should display changelog when passed as props', () => {
    component.setProps({ changelog: getChangelog('basic') })

    expect(component.contains('Some brand new feature')).toBe(true)
  })
})

function getChangelog(filename) {
  return readFileSync(path.join(__dirname, `../../storybook/stories/markdowns/${filename}.md`)).toString()
}

