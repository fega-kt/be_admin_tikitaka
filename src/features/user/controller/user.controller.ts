import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../schema/user.schema';
import { TransformInterceptor } from 'src/transform.interceptor';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseInterceptors(TransformInterceptor) // format data response
  async getListUser(): Promise<User[]> {
    return await this.userService.getListUser();
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    return this.userService.filterUser(
      await this.userService.validateUserByName(username),
    );
  }
}
