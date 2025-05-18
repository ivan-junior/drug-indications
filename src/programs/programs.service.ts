import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DrugsService } from 'src/drugs/drugs.service';
import { IndicationsService } from 'src/indications/indications.service';

@Injectable()
export class ProgramsService {
  constructor(
    @Inject(forwardRef(() => DrugsService))
    private drugsService: DrugsService,

    @Inject(forwardRef(() => IndicationsService))
    private indicationsService: IndicationsService,
  ) {}

  async getProgram(programId: string) {
    const drug = await this.drugsService.findOne(programId);
    const indications = await this.indicationsService.findByDrug(programId);

    return {
      programId: drug._id,
      name: drug.name,
      source: drug.dailyMedUrl,
      indications: indications.map((ind) => ({
        condition: ind.condition,
        icd10Code: ind.icd10Code || null,
        icd10Description: ind.icd10Description || null,
        unmapped: ind.unmapped,
      })),
      createdAt: drug.createdAt,
    };
  }
}
