import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async createUser(createUserDto: CreateUserDto): Promise<{ message: string; user: User }> {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return {
      message: 'User created successfully',
      user: await newUser.save(),
    }
  }

  //login user and return token
  async loginUser(
    email: string,
    password: string,
  ): Promise<{ message: string; token: string; userData: any }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT Token
    const payload = { userId: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    // Remove password before returning user data for security reasons
    const { password: _, ...userData } = user.toObject();

    return {
      message: 'Login successful',
      token,
      userData,
    };
  }

  async getUsers(){
    return {
      message:'Users fetched successfully',
      users: await this.userModel.find()
    }
  }

  async getUserById(id: string){
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error('Invalid id');
    const findUser = await this.userModel.findById(id);
    if (!findUser) throw new Error('User not found');
    return {
      message:'User fetched successfully',
      user: findUser
  }
  }

 async updateUser(id: string, updateUserDto: UpdateUserDto){
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error('Invalid id');
    const findUser = await this.userModel.findById(id);
    if (!findUser) throw new Error('User not found');
    return {
      message:'User updated successfully',
      user: await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true })
    }
  }

  async deleteUser(id: string){
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error('Invalid id');
    const findUser = await this.userModel.findById(id);
    if (!findUser) throw new Error('User not found');
    return {
      message:'User deleted successfully',
      user: await this.userModel.findByIdAndDelete(id)
    }
  }
}
