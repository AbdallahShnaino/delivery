import { HttpException, HttpStatus } from '@nestjs/common';

export enum Message {
  IdCouldNotBeNull = 'id could not be null be sure to provide it!',
  DuplicatedEmail = 'Email has been used before!',
  RemoveFailed = 'failed to update this recourse try again',
  UpdateFailed = 'failed to update this recourse try again',
  UserNotFound = 'user not found',
  UserExist = 'user exist',
  BadPassword = 'bad password',
}
export function throwCustomException(message: Message, resCode: HttpStatus) {
  throw new HttpException(message, resCode);
}
