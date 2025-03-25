import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class DemoAccount extends Document {
  @Prop({ required: true, unique: true })
  publicAddress: string;

  @Prop({ required: true })
  privateKey: string;
}

export const DemoAccountSchema = SchemaFactory.createForClass(DemoAccount);