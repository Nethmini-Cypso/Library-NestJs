import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://backend:backend@backend.ab8pc.mongodb.net/libraryManage?retryWrites=true&w=majority&appName=backend'),
    UsersModule,
    BooksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}