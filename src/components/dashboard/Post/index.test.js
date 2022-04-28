import React from 'react'
import ReactDOM from 'ReactDOM'
import { render } from '@testing-library/react'
import Post from './Post.js'

import renderer from 'react-test-renderer'

it('renders the post', () => {

    const div = document.createElement('div')

    ReactDOM.render(<Post />, div)

    expect(div).not.toHaveStyle('display: none')
});

// it('matches snapshot', () => {
//     const tree = renderer.create(<Post />).toJSON()
//     expect(tree).toMatchSnapshot()
// })