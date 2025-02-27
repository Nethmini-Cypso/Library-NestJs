import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userService.createUser(createUserDto);
  }

   hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };

  //login user and generate token
  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginUser(@Body() loginUserDto: { email: string; password: string }) {
    const result = await this.userService.loginUser(loginUserDto.email, loginUserDto.password);
    return result;  // returns the JWT token
  }


  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error('Invalid id');
    const findUser = await this.userService.getUserById(id);
    if (!findUser) throw new Error('User not found');
    return findUser;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error('Invalid id');
    const findUser = this.userService.getUserById(id);
    if (!findUser) throw new Error('User not found');
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  deleteUser(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error('Invalid id');
    const findUser = this.userService.getUserById(id);
    if (!findUser) throw new Error('User not found');
    return this.userService.deleteUser(id);
  }
}
