import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IndicationDocument = Indication & Document;

@Schema({ timestamps: true })
export class Indication {
  @Prop({ type: Types.ObjectId, ref: 'Drug', required: true })
  drug: Types.ObjectId;

  @Prop({ required: true })
  condition: string; // Ex: "asthma", "atopic dermatitis"

  @Prop()
  icd10Code?: string;

  @Prop()
  icd10Description?: string;

  @Prop({ default: false })
  unmapped: boolean; // true se não foi possível mapear via GPT
}

export const IndicationSchema = SchemaFactory.createForClass(Indication);
