/* eslint-disable no-use-before-define */
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { readFileSync } from 'fs'
import path from 'path'
import ChangeLogModal from './ChangeLogModal'

Enzyme.configure({ adapter: new Adapter() })

let resolver
let fetchCalled = getNewPromise()
global.fetch = mockFetch

describe('ChangeLogModal', () => {
  let component
  let props

  beforeEach(() => {
    component = mount(<ChangeLogModal {...props} />)
    mockFetchingChangelog(component)
  })

  it('should display without error', () => {
    expect(component).toBeTruthy()
  })

  it('should display changelog passed as props', () => {
    component.setProps({ changelog: getChangelogFileContent('basic') })

    expect(component.contains('Some brand new feature')).toBe(true)
  })

  it('should display changelog retrieved from an url', async () => {
    await setChangelogUrl('/markdowns/basic.md')

    expect(component.contains('Some brand new feature')).toBe(true)
  })

  async function setChangelogUrl(url) {
    component.setProps({ url })
    await fetchCalled
    component.update()
  }
})

function mockFetchingChangelog(component) {
  const instance = component.instance()
  const fetchChangelogImpl = instance.fetchChangelog
  instance.fetchChangelog = jest.fn().mockImplementation(async (url) => {
    await fetchChangelogImpl.bind(instance)(url)
    resolver()
    fetchCalled = getNewPromise()
  })
}

function mockFetch(url) {
  return {
    text: () => {
      const parts = url.split('/')
      const filename = parts[parts.length - 1].split('.')[0]
      const content = getChangelogFileContent(filename)
      return Promise.resolve(content)
    },
    ok: true,
  }
}

function getChangelogFileContent(filename) {
  return readFileSync(path.join(__dirname, `../../storybook/stories/markdowns/${filename}.md`)).toString()
}

function getNewPromise() {
  return new Promise((resolve) => { resolver = resolve })
}
