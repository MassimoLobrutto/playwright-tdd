import { APIRequestContext } from '@playwright/test';
import { logger } from '../logger/logger';

export class ApiController {
  // baseUrl is now a required parameter for the instance
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  async createPost(path: string, title: string, body: string, userId: number = 1) {
    const url = `${this.baseUrl}${path}`;
    logger.info(`🚀 POST Request to: ${url}`);
    return await this.request.post(url, {
      data: { title, body, userId },
    });
  }

  async getPost(path: string) {
    const url = `${this.baseUrl}${path}`;
    logger.info(`🔍 GET Request to: ${url}`);
    return await this.request.get(url);
  }

  async updatePost(path: string, title: string) {
    const url = `${this.baseUrl}${path}`;
    logger.info(`🔄 PUT Request to: ${url}`);
    return await this.request.put(url, {
      data: { id: 1, title, body: 'updated body', userId: 1 },
    });
  }

  async deletePost(path: string) {
    const url = `${this.baseUrl}${path}`;
    logger.info(`🗑️ DELETE Request to: ${url}`);
    return await this.request.delete(url);
  }
}
