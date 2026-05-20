const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {

    // reset database
    await request.post('http://localhost:3003/api/testing/reset')

    // create first user
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'John Doe',
        username: 'johndoe',
        password: 'secret'
      }
    })

    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {

      await page.getByTestId('username').fill('johndoe')
      await page.getByTestId('password').fill('secret')

      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('John Doe logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {

      await page.getByTestId('username').fill('johndoe')
      await page.getByTestId('password').fill('wrongpassword')

      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {

    beforeEach(async ({ page }) => {

      await page.getByTestId('username').fill('johndoe')
      await page.getByTestId('password').fill('secret')

      await page.getByRole('button', { name: 'Login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {

      await page.getByRole('button', { name: 'Create new blog' }).click()

      await page.getByTestId('title').fill('Playwright Blog')
      await page.getByTestId('url').fill('https://playwright.dev')

      await page.getByRole('button', { name: 'Create' }).click()

      await expect(
        page.getByText('Playwright Blog')
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {

      // create blog
      await page.getByRole('button', { name: 'Create new blog' }).click()

      await page.getByTestId('title').fill('Like Test Blog')
      await page.getByTestId('url').fill('https://example.com')

      await page.getByRole('button', { name: 'Create' }).click()

      // open details
      const blogContainer = page.locator('.short', { hasText: 'Like Test Blog' })
      await blogContainer.getByRole('button', { name: 'view' }).click()

      // like blog
      const expandedBlogContainer = page.locator('.showAll', { hasText: 'Like Test Blog' })
      await expandedBlogContainer.getByRole('button', { name: 'like' }).click()

      await expect(
        expandedBlogContainer.getByText('1 likes')
      ).toBeVisible()
    })

    test('user can delete own blog', async ({ page }) => {

      // create blog
      await page.getByRole('button', { name: 'Create new blog' }).click()

      await page.getByTestId('title').fill('Delete Test Blog')
      await page.getByTestId('url').fill('https://delete.com')

      await page.getByRole('button', { name: 'Create' }).click()

      const blogContainer = page.locator('.short', { hasText: 'Delete Test Blog' })
      await blogContainer.getByRole('button', { name: 'view' }).click()

      // auto accept confirm dialog
      page.on('dialog', dialog => dialog.accept())

      const expandedBlogContainer = page.locator('.showAll', { hasText: 'Delete Test Blog' })
      await expandedBlogContainer.getByRole('button', { name: 'remove' }).click()

      await expect(
        page.getByText('Delete Test Blog')
      ).not.toBeVisible()
    })

    test('only creator sees delete button', async ({ page, request }) => {

      // create blog as first user
      await page.getByRole('button', { name: 'Create new blog' }).click()

      await page.getByTestId('title').fill('Protected Blog')
      await page.getByTestId('url').fill('https://protected.com')

      await page.getByRole('button', { name: 'Create' }).click()

      // logout
      await page.getByRole('button', { name: 'logout' }).click()

      // create second user
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Another User',
          username: 'anotheruser',
          password: 'secret'
        }
      })

      // login as second user
      await page.getByTestId('username').fill('anotheruser')
      await page.getByTestId('password').fill('secret')

      await page.getByRole('button', { name: 'Login' }).click()

      // open blog
      const blogContainer = page.locator('.short', { hasText: 'Protected Blog' })
      await blogContainer.getByRole('button', { name: 'view' }).click()

      // remove button should not exist
      const expandedBlogContainer = page.locator('.showAll', { hasText: 'Protected Blog' })
      await expect(
        expandedBlogContainer.getByRole('button', { name: 'remove' })
      ).not.toBeVisible()
    })
  })
})