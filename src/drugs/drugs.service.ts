import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { Drug, DrugDocument } from './drugs.schema';

/**
 * Service responsible for managing drugs in the system
 */
@Injectable()
export class DrugsService {
  constructor(@InjectModel(Drug.name) private drugModel: Model<DrugDocument>) {}

  /**
   * Creates a new drug
   * @param dto - The drug data to create
   * @returns Promise with the created drug document
   */
  async create(dto: CreateDrugDto): Promise<DrugDocument> {
    return await this.drugModel.create(dto);
  }

  /**
   * Retrieves all drugs from the database
   * @returns Promise with array of all drug documents
   */
  async findAll(): Promise<Drug[]> {
    return this.drugModel.find().exec();
  }

  /**
   * Finds a single drug by ID
   * @param id - The ID of the drug to find
   * @returns Promise with the found drug document including creation date
   * @throws {NotFoundException} When drug is not found
   */
  async findOne(id: string): Promise<DrugDocument & { createdAt: Date }> {
    const drug = await this.drugModel.findById(id).exec();
    if (!drug) throw new NotFoundException('Drug not found');
    return drug as unknown as DrugDocument & { createdAt: Date };
  }

  /**
   * Updates a drug
   * @param id - The ID of the drug to update
   * @param dto - The data to update the drug with
   * @returns Promise with the updated drug
   * @throws {NotFoundException} When drug is not found
   */
  async update(id: string, dto: UpdateDrugDto): Promise<Drug> {
    const updated = await this.drugModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Drug not found');
    return updated;
  }

  /**
   * Removes a drug
   * @param id - The ID of the drug to remove
   * @throws {NotFoundException} When drug is not found
   */
  async remove(id: string): Promise<void> {
    const deleted = await this.drugModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Drug not found');
  }
}
