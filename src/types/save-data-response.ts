import { ApiProperty } from '@nestjs/swagger';

export enum ResponseStatus {
  OK = 'OK',
  FAIL = 'FAIL',
}

export class SaveDataResponse {
  @ApiProperty()
  status: ResponseStatus;
}
