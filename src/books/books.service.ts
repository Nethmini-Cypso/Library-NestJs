import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from 'src/schemas/Book.schema';
import { PublishBookDto } from './dto/PublishBook.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel('Book') private readonly bookModel: Model<Book>) {}

  async publishBook(
    publishBookDto: PublishBookDto & { book: string; coverImage: string },
  ) {
    const createdBook = new this.bookModel(publishBookDto);
    try {
      const result = await createdBook.save();
      return {
        message: 'Book published successfully',
        book: result,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
