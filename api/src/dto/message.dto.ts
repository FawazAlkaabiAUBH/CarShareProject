import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  rideId: number;

  @IsNotEmpty()
  @IsNumber()
  toUserId: number;

  @IsNotEmpty()
  @IsString()
  text: string;
}

export class GetMessagesDto {
  @IsNotEmpty()
  @IsNumber()
  rideId: number;
}

export class MarkReadDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
