import { test, expect } from '@playwright/test'
import { env } from './env'

test('click on header', async ({ page }) => {
    await page.goto(env.BASE_URL)
    const titleDiv = page.getByText('Titel')
    await titleDiv.click()
    await page.keyboard.insertText('Test')
    await page.waitForTimeout(500)
    await expect(titleDiv).toHaveText('Test', { timeout: 500 })
})
