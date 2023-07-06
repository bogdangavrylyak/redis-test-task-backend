import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SaveDataDto } from './dto';
import { SaveDataResponse } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBearerAuth()
  @Get()
  public async getData(@Headers('Authorization') authorization: string) {
    if (!authorization) {
      throw new HttpException(`Missing JWT token`, HttpStatus.FORBIDDEN);
    }
    const token = authorization.split('Bearer ')[1];
    if (!token) {
      throw new HttpException(`Missing JWT token`, HttpStatus.FORBIDDEN);
    }
    return await this.appService.getData(token);
  }

  @ApiResponse({ status: 200, description: 'Success', type: SaveDataResponse })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: SaveDataDto })
  @Post()
  public async saveData(
    @Body() saveDataDto: SaveDataDto,
  ): Promise<SaveDataResponse> {
    const key = Object.keys(saveDataDto)[0];
    const value = saveDataDto[key];
    return await this.appService.saveData(key, value);
  }
}
