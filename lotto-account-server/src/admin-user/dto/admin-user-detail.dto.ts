import { ApiProperty } from "@nestjs/swagger";
import { AdminUserDto } from "./admin-user.dto";

export class AdminUserDetailDto {
  @ApiProperty()
  adminUserDto: AdminUserDto;

  @ApiProperty()
  roleList: RoleDto[];

  static from(adminUserDto: AdminUserDto, roleList: RoleDto[]) {
    const adminUserRoleDto = new AdminUserDetailDto();
    adminUserRoleDto.adminUserDto = adminUserDto;
    adminUserRoleDto.roleList = roleList;
    return adminUserRoleDto;
  }
}
