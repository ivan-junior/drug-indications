import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateIndicationDto } from './dto/create-indication.dto';
import { Indication, IndicationDocument } from './indications.schema';
import { UpdateIndicationDto } from './dto/update-indication.dto';

@Injectable()
export class IndicationsService {
  constructor(
    @InjectModel(Indication.name)
    private indicationModel: Model<IndicationDocument>,
  ) {}

  async create(dto: CreateIndicationDto): Promise<Indication> {
    return this.indicationModel.create(dto);
  }

  async findAll(): Promise<Indication[]> {
    return this.indicationModel.find().populate('drug').exec();
  }

  async findByDrug(drugId: string): Promise<Indication[]> {
    return this.indicationModel.find({ drug: drugId }).populate('drug').exec();
  }

  async findOne(id: string): Promise<Indication> {
    const indication = await this.indicationModel
      .findById(id)
      .populate('drug')
      .exec();
    if (!indication) throw new NotFoundException('Indication not found');
    return indication;
  }

  async update(id: string, dto: UpdateIndicationDto): Promise<Indication> {
    const updated = await this.indicationModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Indication not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.indicationModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Indication not found');
  }
}
