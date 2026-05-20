import { render, screen } from '@testing-library/react'
import New_blog from './new_blog'
import userEvent from '@testing-library/user-event'

test('<New_blog /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<New_blog createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('write title here')
  const urlInput = screen.getByPlaceholderText('write url here')
  const sendButton = screen.getByText('Create')

  await user.type(titleInput, 'testing a form...')
  await user.type(urlInput, 'https://example.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
  expect(createBlog.mock.calls[0][0].url).toBe('https://example.com')
})