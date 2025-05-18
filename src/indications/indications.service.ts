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

  async create(dto: CreateIndicationDto): Promise<IndicationDocument> {
    return this.indicationModel.create({
      ...dto,
      drug: new Types.ObjectId(dto.drug),
    });
  }

  async findAll(): Promise<IndicationDocument[]> {
    return this.indicationModel.find().populate('drug').exec();
  }

  async findByDrug(drugId: string): Promise<IndicationDocument[]> {
    return this.indicationModel
      .find({ drug: new Types.ObjectId(drugId) })
      .populate('drug')
      .exec();
  }

  async findOne(id: string): Promise<IndicationDocument> {
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
    const deleted = await this.indicationModel
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();
    if (!deleted) throw new NotFoundException('Indication not found');
  }

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
