import { test, expect } from '../../../fixtures/fixtures';
import { logger } from '../../../helper/logger/logger';

test.describe('Search for persons and guides in angular search page', () => {
  test.beforeEach(async ({ chambersHomePage, chambersNavPage }) => {
    await test.step('Navigate to homepage', async () => {
      await chambersHomePage.navigateToHomepage();
    });

    await test.step('Select Research Team page from top nav', async () => {
      await chambersNavPage.selectAndVerifyMenuSubItem('Submissions', 'Research Team');
    });
  });

  test('Verify search results displayed results searching by first name', async ({
    page,
    chambersNavPage,
    chambersResearchTeamPage,
  }) => {
    await test.step('Select menu and sub-menu item', async () => {
      await chambersNavPage.selectAndVerifyMenuSubItem('Submissions', 'Research Team');
    });

    const personName = 'ALEX';

    await test.step(`Search for person: ${personName}`, async () => {
      await chambersResearchTeamPage.enterName(personName);
    });

    await test.step('Verify search results display the correct user', async () => {
      const headings = page.getByRole('heading', { name: personName });
      await expect(headings.first()).toBeVisible();
      logger.info(`Number of results for ${personName}: ${await headings.count()}`);
      expect(await headings.count()).toBeGreaterThanOrEqual(1);
    });
  });

  test('Verify no results when search on non existant name', async ({ page, chambersResearchTeamPage }) => {
    const personName = 'NOBODY';

    await test.step(`Search for person: ${personName}`, async () => {
      await chambersResearchTeamPage.enterName(personName);
    });

    await test.step('Verify search results display the correct user', async () => {
      logger.info(`Verifying no results are displayed for search term: ${personName}`);
      await expect(
        page.getByText('There are no results matching your criteria. Please try searching again')
      ).toBeVisible();
    });
  });

  test('Verify search results displayed for a specific region', async ({ page, chambersResearchTeamPage }) => {
    const guide = 'Europe';

    await test.step(`Search for region: ${guide}`, async () => {
      await chambersResearchTeamPage.selectGuide(guide);
    });

    await test.step(`Verify results for region: ${guide} are displayed`, async () => {
      const regionHeadings = page.getByRole('heading', { name: guide, exact: true });
      await expect(regionHeadings.first()).toBeVisible();
      logger.info(`Number of results for region ${guide}: ${await regionHeadings.count()}`);
      expect(await regionHeadings.count()).toBeGreaterThanOrEqual(1);
    });
  });
});
