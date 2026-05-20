import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    user: 'John Doe',
    url: 'https://example.com',
    likes: 5
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})

test('url and likes are not shown by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    user: 'John Doe',
    url: 'https://example.com',
    likes: 5
  }
  const { container } = render(<Blog blog={blog} />)

  expect(
    screen.queryByText('https://example.com')
  ).toBeNull()

  expect(
    screen.queryByText('5 likes')
  ).toBeNull()
  }
)

test('url and likes are shown when the view button is clicked', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    user: 'John Doe',
    url: 'https://example.com',
    likes: 5
  }
  const { container } = render(<Blog blog={blog} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const div = container.querySelector('.showAll')
  expect(div).toHaveTextContent('5 likes')
  expect(div).toHaveTextContent('https://example.com')
}
)

test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    user: 'John Doe',
    url: 'https://example.com',
    likes: 5
  }
  
  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} handleLike={mockHandler} />
  )

  const user = userEvent.setup()
  const viewButton =
    screen.getByText('view')

  await user.click(viewButton)

  const likeButton =
    screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler)
    .toHaveBeenCalledTimes(2)
})


