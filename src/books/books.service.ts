import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Book } from 'src/schemas/Book.schema';
import { PublishBookDto } from './dto/PublishBook.dto';
import { UpdateBookDto } from './dto/UpdateBook.dto';

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

  async getAllBooks() {
    return {
      message: 'All books fetched successfully',
      books: await this.bookModel.find(),
    }
  }

  async getBookById(id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error('Invalid id');
    const findBook = await this.bookModel.findById(id);
    if (!findBook) throw new Error('Book not found');
    return {
      message: 'Book fetched successfully',
      book: findBook
    };
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error('Invalid id');
    const findBook = await this.bookModel.findById(id);
    if (!findBook) throw new Error('Book not found');
    return {
      message:'Book updated successfully',
      book: await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true })
    }
  }

  async deleteBook (id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error('Invalid id');
    const findBook = await this.bookModel.findById(id);
    if (!findBook) throw new Error('Book not found');
    return {
      message: 'Book deleted successfully',
      book: await this.bookModel.findByIdAndDelete(id)
    };
  }
}
