import { ApiProperty } from "@nestjs/swagger";
import { AdminUserDto } from "./admin-user.dto";

export class AdminProfileDto {
  @ApiProperty()
  adminUserDto: AdminUserDto;

  @ApiProperty()
  roleList: RoleDto[];

  @ApiProperty()
  menuRolePermissionList: object;

  static from(adminUserDto: AdminUserDto, roleList: RoleDto[], menuRolePermissionList: object) {
    const adminProfileDto = new AdminProfileDto();
    adminProfileDto.adminUserDto = adminUserDto;
    adminProfileDto.roleList = roleList;
    adminProfileDto.menuRolePermissionList = menuRolePermissionList;
    return adminProfileDto;
  }
}
