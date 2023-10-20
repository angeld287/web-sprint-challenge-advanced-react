// Write your tests here
import AppFunctional from './AppFunctional'
import React from 'react'
import { render, within, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

let coordinates, steps, DOWN, email, submit;
const label = 'FUNCTIONAL';

const updateStatefulSelectors = document => {
  coordinates = document.querySelector('#coordinates')
  steps = document.querySelector('#steps')
  DOWN = document.querySelector('#down')
  email = document.querySelector('#email')
  submit = document.querySelector('#submit')
}

describe(`${label}`, () => {
  beforeEach(() => {
    render(<AppFunctional />)
    updateStatefulSelectors(document)
  })

  //Test that the visible texts in headings, buttons, links... render on the screen.
  test(`[E5 ${label}] Text "Coordinates (2, 2)" is present on screen`, () => {
    const { getByText } = within(coordinates)
    expect(getByText('Coordinates (2, 2)')).toBeInTheDocument()
  })

  test(`[E5 ${label}] Text "You moved 0 times" is present on screen`, () => {
    const { getByText } = within(steps)
    expect(getByText('You moved 0 times')).toBeInTheDocument()
  })

  test(`[E5 ${label}] Button DOWN is present on screen`, () => {
    expect(DOWN).toBeInTheDocument()
  })

  test(`[E5 ${label}] Button Submit is present on screen`, () => {
    expect(submit).toBeInTheDocument()
  })

  //Test that typing on the input results in its value changing to the entered text.
  test(`[E5 ${label}] typing on Email, results in its value changing to the entered text`, () => {
    fireEvent.change(email, { target: { value: 'test' } })
    expect(email).toHaveValue('test')
  })

})
