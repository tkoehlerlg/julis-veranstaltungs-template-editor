import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('./')
})

test('update header', async ({ page }) => {
    const titlePTag = page.getByText('Titel')
    await titlePTag.click()
    await page.keyboard.insertText('Test')

    expect(async () => {
        const updatedTitle = await titlePTag.textContent({ timeout: 500 })
        return updatedTitle === 'Test'
    }).toBeTruthy()
})

test('update card', async ({ page }) => {
    const card = page.getByText('Event Title')
    await card.click()
    await page.keyboard.insertText('Test')

    expect(async () => {
        const updatedCard = await card.textContent({ timeout: 500 })
        return updatedCard === 'Test'
    }).toBeTruthy()
})

test('delete card', async ({ page }) => {
    const card = page.getByText('Event Title')
    await card.click()
    const deleteButton = page.getByRole('button', { name: 'Löschen' })
    await deleteButton.click()

    await expect(card).toBeVisible({ timeout: 500, visible: false })
})

test('add card', async ({ page }) => {
    const addCardButton = page.getByTestId('add-card-0')
    await addCardButton.hover()
    await addCardButton.click()
    await expect(page.locator('p', { hasText: 'Neues Event' })).toBeVisible()
    await expect(page.getByText('Event Title')).toBeVisible()
})

test('move card', async ({ page }) => {
    // add second card
    const addCardButton = page.getByTestId('add-card-1')
    await addCardButton.hover()
    await addCardButton.click()
    await expect(page.locator('p', { hasText: 'Neues Event' })).toBeVisible()
    // move second card to first position
    const secondCard = page.locator('p', { hasText: 'Neues Event' })
    await secondCard.click()
    const moveButton = page.getByTestId('move-up')
    await moveButton.click()
    const cardBox = page.getByTestId('card-box')
    await expect(cardBox).toHaveCount(2)
    await expect(cardBox.nth(0)).toHaveText('Neues Event')
})

test('update category', async ({ page }) => {
    const category = page.getByText('Kategorie Name')
    await category.click()
    await page.keyboard.insertText('Test')

    expect(async () => {
        const updatedCategory = await category.textContent({ timeout: 500 })
        return updatedCategory === 'Test'
    }).toBeTruthy()
})

test('delete category', async ({ page }) => {
    const category = page.getByText('Kategorie Name')
    await category.click()
    const deleteButton = page.getByRole('button', { name: 'Löschen' })
    await deleteButton.click()

    await expect(category).toBeVisible({ timeout: 500, visible: false })
})

test('update category name in card', async ({ page }) => {
    const card = page.getByText('Event Title')
    await card.click()
    const categoryTextField = page.getByPlaceholder('Kategorie')
    await categoryTextField.click()
    await categoryTextField.fill('Test Kategorie')
    await expect(page.locator('p', { hasText: 'Test Kategorie' })).toBeVisible()
})
