import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class UserProfileDto {
  @ApiProperty()
  userDto: UserDto;

  @ApiProperty()
  assetBalance: number;

  @ApiProperty()
  ongoingTicketCount: number;

  static from(userDto: UserDto, assetBalance: number, ongoingTicketCount: number) {
    const newClass = new UserProfileDto();
    newClass.userDto = userDto;
    newClass.assetBalance = assetBalance;
    newClass.ongoingTicketCount = ongoingTicketCount;
    return newClass;
  }
}
