import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import ChangeLogModal from './ChangeLogModal'

Enzyme.configure({ adapter: new Adapter() })

test('should display without error', () => {
  const component = mount(<ChangeLogModal />)
  expect(component).toBeTruthy()
})
