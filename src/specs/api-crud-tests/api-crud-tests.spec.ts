import { test, expect } from '../../fixtures/fixtures';
import { logger } from '../../helper/logger/logger';

test.describe('Post API Operations @apiTests @regression', () => {
  test('should handle the full lifecycle of a post', async ({ apiController, apiResponse }) => {
    await test.step('Create a new post', async () => {
      const path = '/posts';
      const title = 'TDD Post';
      const body = 'This is a vanilla test';

      apiResponse.last = await apiController.createPost(path, title, body);
      const responseBody = await apiResponse.last.json();

      logger.info(`📦 Response Body: ${JSON.stringify(responseBody)}`);

      expect(apiResponse.last.status()).toBe(201);
      expect(responseBody.title).toBe(title);
    });

    await test.step('Get the created post', async () => {
      apiResponse.last = await apiController.getPost('/posts/1');
      logger.info(`✅ GET Response Status: ${apiResponse.last.status()}`);

      expect(apiResponse.last.status()).toBe(200);
    });

    await test.step('Update the post title', async () => {
      const updatedTitle = 'Updated via TDD';
      apiResponse.last = await apiController.updatePost('/posts/1', updatedTitle);

      const body = await apiResponse.last.json();
      logger.info(`✅ PUT Response Status: ${apiResponse.last.status()}`);

      expect(apiResponse.last.status()).toBe(200);
      expect(body.title).toBe(updatedTitle);
    });

    await test.step('Delete the post', async () => {
      apiResponse.last = await apiController.deletePost('/posts/1');
      logger.info(`✅ DELETE Response Status: ${apiResponse.last.status()}`);

      expect(apiResponse.last.status()).toBe(200);
    });
  });
});
