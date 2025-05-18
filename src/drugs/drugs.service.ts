import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { Drug, DrugDocument } from './drugs.schema';

@Injectable()
export class DrugsService {
  constructor(@InjectModel(Drug.name) private drugModel: Model<DrugDocument>) {}

  async create(dto: CreateDrugDto): Promise<Drug> {
    const drug = new this.drugModel(dto);
    return drug.save();
  }

  async findAll(): Promise<Drug[]> {
    return this.drugModel.find().exec();
  }

  async findOne(id: string): Promise<DrugDocument & { createdAt: Date }> {
    const drug = await this.drugModel.findById(id).exec();
    if (!drug) throw new NotFoundException('Drug not found');
    return drug as unknown as DrugDocument & { createdAt: Date };
  }

  async update(id: string, dto: UpdateDrugDto): Promise<Drug> {
    const updated = await this.drugModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Drug not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.drugModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Drug not found');
  }
}
