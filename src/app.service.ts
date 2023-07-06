import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ResponseStatus, SaveDataResponse } from './types';
import { TokenService } from './token/token.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly tokenService: TokenService,
  ) {}

  public async saveData(key: string, value: string): Promise<SaveDataResponse> {
    try {
      this.logger.log(`Saving (${key}: ${value}) data to Redis`);
      await this.cacheManager.set(key, value);
      this.logger.log(`Saved successfully`);
      return {
        status: ResponseStatus.OK,
      };
    } catch (error) {
      this.logger.log(`Error saving data. Message: ${error.message}`);
      return {
        status: ResponseStatus.FAIL,
      };
    }
  }

  public async getData(token: string) {
    const tokenCheck = this.tokenService.decodeJWT(token);
    try {
      this.logger.log(
        `Getting data from Redis by user: ${tokenCheck.payload.user}`,
      );
      const keys = await this.cacheManager.store.keys('*');
      const data = await this.cacheManager.store.mget(...keys);
      return keys.reduce((obj, key, index) => {
        obj[key] = data[index];
        return obj;
      }, {});
    } catch (error) {
      this.logger.log(`Error getting data. Message: ${error.message}`);
      return {
        status: ResponseStatus.FAIL,
      };
    }
  }
}
