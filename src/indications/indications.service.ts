import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateIndicationDto } from './dto/create-indication.dto';
import { Indication, IndicationDocument } from './indications.schema';
import { UpdateIndicationDto } from './dto/update-indication.dto';
import { DrugsService } from 'src/drugs/drugs.service';
import { ScraperService } from 'src/scraper/scraper.service';
import { MappingService } from 'src/mapping/mapping.service';

/**
 * Service responsible for managing drug indications, including CRUD operations and automated generation
 */
@Injectable()
export class IndicationsService {
  constructor(
    @InjectModel(Indication.name)
    private indicationModel: Model<IndicationDocument>,

    @Inject(forwardRef(() => DrugsService))
    private drugsService: DrugsService,

    @Inject(forwardRef(() => ScraperService))
    private scraperService: ScraperService,

    @Inject(forwardRef(() => MappingService))
    private mappingService: MappingService,
  ) {}

  /**
   * Creates a new indication
   * @param dto - The indication data to create
   * @returns Promise with the created indication document
   */
  async create(dto: CreateIndicationDto): Promise<IndicationDocument> {
    return this.indicationModel.create({
      ...dto,
      drug: new Types.ObjectId(dto.drug),
    });
  }

  /**
   * Retrieves all indications with populated drug references
   * @returns Promise with array of all indication documents
   */
  async findAll(): Promise<IndicationDocument[]> {
    return this.indicationModel.find().populate('drug').exec();
  }

  /**
   * Finds all indications for a specific drug
   * @param drugId - The ID of the drug to find indications for
   * @returns Promise with array of indication documents for the drug
   */
  async findByDrug(drugId: string): Promise<IndicationDocument[]> {
    return this.indicationModel
      .find({ drug: new Types.ObjectId(drugId) })
      .populate('drug')
      .exec();
  }

  /**
   * Finds a single indication by ID
   * @param id - The ID of the indication to find
   * @returns Promise with the found indication document
   * @throws {NotFoundException} When indication is not found
   */
  async findOne(id: string): Promise<IndicationDocument> {
    const indication = await this.indicationModel
      .findById(id)
      .populate('drug')
      .exec();
    if (!indication) throw new NotFoundException('Indication not found');
    return indication;
  }

  /**
   * Updates an indication
   * @param id - The ID of the indication to update
   * @param dto - The data to update the indication with
   * @returns Promise with the updated indication
   * @throws {NotFoundException} When indication is not found
   */
  async update(id: string, dto: UpdateIndicationDto): Promise<Indication> {
    const updated = await this.indicationModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Indication not found');
    return updated;
  }

  /**
   * Removes an indication
   * @param id - The ID of the indication to remove
   * @throws {NotFoundException} When indication is not found
   */
  async remove(id: string): Promise<void> {
    const deleted = await this.indicationModel
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();
    if (!deleted) throw new NotFoundException('Indication not found');
  }

  /**
   * Generates indications for a drug by scraping information and mapping to ICD-10 codes
   * @param drugId - The ID of the drug to generate indications for
   * @returns Promise with the created indications and count
   * @throws {NotFoundException} When drug is not found
   */
  async generateFromScraper(drugId: string) {
    const drug = await this.drugsService.findOne(drugId);
    const phrases = await this.scraperService.extractIndications();

    const created: Indication[] = [];

    for (const condition of phrases) {
      try {
        const { code, description } =
          await this.mappingService.mapToICD10(condition);
        const indication = await this.indicationModel.create({
          drug: drug._id,
          condition,
          icd10Code: code,
          icd10Description: description,
          unmapped: false,
        });
        created.push(indication);
      } catch (err) {
        const fallback = await this.indicationModel.create({
          drug: drug._id,
          condition,
          unmapped: true,
        });
        created.push(fallback);
      }
    }

    return {
      createdCount: created.length,
      indications: created,
    };
  }
}
