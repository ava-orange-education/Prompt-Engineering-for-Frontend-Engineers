import { test, expect } from '@playwright/test';

test.describe('FormForge', () => {
  test('form list page loads and shows at least two form links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const links = page.getByRole('link');
    expect(await links.count()).toBeGreaterThanOrEqual(2);
  });

  test('clicking employee-onboarding navigates to the form', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.getByRole('link', { name: /Employee Onboarding/i }).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/forms\/employee-onboarding/);
  });

  test('form title is visible', async ({ page }) => {
    await page.goto('/forms/employee-onboarding');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Employee Onboarding Form' })).toBeVisible();
  });

  test('submitting empty form shows multiple validation errors', async ({ page }) => {
    await page.goto('/forms/employee-onboarding');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Submit Onboarding Form' }).click();

    // Validation errors render after the click triggers async state; .count()
    // doesn't auto-retry, so wait for the first one to appear before counting.
    await expect(page.locator('p.text-red-600').first()).toBeVisible();
    const errorCount = await page.locator('p.text-red-600').count();
    expect(errorCount).toBeGreaterThan(1);
  });

  test('selecting Contractor hides salary and shows contractEndDate', async ({ page }) => {
    await page.goto('/forms/employee-onboarding');
    await page.waitForLoadState('networkidle');

    await expect(page.getByLabel('Salary Expectation')).toBeVisible();
    await expect(page.getByLabel('Contract End Date')).toHaveCount(0);

    await page.getByLabel('Contractor').click();

    await expect(page.getByLabel('Salary Expectation')).toHaveCount(0);
    await expect(page.getByLabel('Contract End Date')).toBeVisible();
  });

  test('completing and submitting with valid data shows success message', async ({ page }) => {
    await page.goto('/forms/employee-onboarding');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('First Name').fill('Jamie');
    await page.getByLabel('Last Name').fill('Chen');
    await page.getByLabel('Email Address').fill('jamie.chen@example.com');
    await page.getByLabel('Phone Number').fill('+14155552671');
    await page.getByLabel('Date of Birth').fill('1994-05-12');
    await page.getByLabel('Female').click();

    await page.getByLabel('Job Title').fill('Software Engineer');
    await page.getByLabel('Department').selectOption('engineering');
    await page.getByLabel('Start Date').fill('2026-10-01');
    await page.getByLabel('Full-time').click();
    await page.getByLabel('Salary Expectation').fill('120000');

    await page.getByLabel('Contact Name').fill('Alex Chen');
    await page.getByLabel('Relationship').selectOption('spouse');
    await page.getByLabel('Emergency Phone').fill('+14155559999');

    await page.getByLabel('macOS').click();
    await page.getByLabel('Slack Display Name').fill('jamiechen');

    await page.getByRole('button', { name: 'Submit Onboarding Form' }).click();

    await expect(
      page.getByText('Welcome to the team! Your information has been submitted.'),
    ).toBeVisible();
  });

  test('Leave Request form loads at /forms/leave-request', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.goto('/forms/leave-request');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Leave Request Form' })).toBeVisible();
  });
});
