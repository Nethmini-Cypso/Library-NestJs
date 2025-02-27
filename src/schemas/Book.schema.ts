import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Book extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  genre: string;

  @Prop({ default: new Date() })
  publicationDate: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  book: string;  

  @Prop({ required: true })
  coverImage: string; 
}

export const BookSchema = SchemaFactory.createForClass(Book);
