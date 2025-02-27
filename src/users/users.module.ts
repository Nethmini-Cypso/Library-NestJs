import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        '9ba7e44f89d5a959a328b3bc32d8dd09bbbc5ca430d7ae5cc70cdaf60a5a0a606ebd85012dd177ca6c4ea18c738ee73a739a6fcf7e58b82ffe42df92dcb3bb54d5af25ea1db8b79c23b9ea2785d386987f19abc12c8196b1fe18a549e563cf5b6cf4e99e757b1c3672154d7e661a5ee5842d61f5b5a4ee9353edb53e0d2388a8ee6effd6208145330cdb9c8e20cb13f410a4d4945367c1dfdac93f055767ed9995999d2078f9a9711916752b2d6575515825cda9dee53927deb066fbd0b5731ac5fb38e41f29dcc83dfa256dcc60ab1744878a4e72efaadc2106392416aac0602595d80a639be7b28ef20250ef1442dc6a6209105f4096516b744360df670936', // Store in env variable for security
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
