import { test, expect } from '@playwright/test'
import { env } from './env'

test('click on header', async ({ page }) => {
    await page.goto(env.BASE_URL)
    const titlePTag = page.getByText('Titel')
    await titlePTag.click()
    await page.keyboard.insertText('Test')

    expect(async () => {
        const updatedTitle = await titlePTag.textContent({ timeout: 1000 })
        return updatedTitle === 'Test'
    }).toBeTruthy()
})
