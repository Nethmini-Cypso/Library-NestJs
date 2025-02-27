import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Get,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { BooksService } from "./books.service";
import { PublishBookDto } from "./dto/PublishBook.dto";
import * as Multer from 'multer';
import { UpdateBookDto } from "./dto/UpdateBook.dto";

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'book', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'book') {
              cb(null, './uploads/books');
            } else if (file.fieldname === 'coverImage') {
              cb(null, './uploads/images');
            }
          },
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
          }
        }),
        limits: {
          fileSize: 10 * 1024 * 1024 // Max size: 10MB for book, 5MB for cover
        },
        fileFilter: (req, file, cb) => {
          if (file.fieldname === 'book' && file.mimetype !== 'application/pdf') {
            return cb(new BadRequestException('Only PDF files are allowed for book!'), false);
          }
          if (file.fieldname === 'coverImage' && !['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
            return cb(new BadRequestException('Only JPEG, JPG, PNG images are allowed for cover image!'), false);
          }
          cb(null, true);
        }
      }
    )
  )
  async publishBook(
    @Body() publishBookDto: PublishBookDto,
    @UploadedFiles() files: { book?: Multer.File[], coverImage?: Multer.File[] }
  ) {
    if (!files.book || files.book.length === 0) throw new BadRequestException('PDF file is required');
    if (!files.coverImage || files.coverImage.length === 0) throw new BadRequestException('Image file is required');

    const bookFile = files.book[0];
    const coverImageFile = files.coverImage[0];

   
    const bookData = {
      ...publishBookDto,
      book: `/uploads/books/${bookFile.filename}`,
      coverImage: `/uploads/images/${coverImageFile.filename}`,
    };

    return this.booksService.publishBook(bookData);
  }

  @Get()
  async getAllBooks() {
    return this.booksService.getAllBooks();
  }

  @Get(':id')
  async getBookById(@Param('id') id: string) {
    return this.booksService.getBookById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    return this.booksService.deleteBook(id);
  }

}
