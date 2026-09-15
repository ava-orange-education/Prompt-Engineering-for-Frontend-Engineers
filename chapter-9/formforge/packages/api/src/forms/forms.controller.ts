import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import type { FormConfig, FormSummary } from '@formforge/types';
import { FormsService } from './forms.service';
import { SubmitFormDto } from './dto/submit-form.dto';

@Controller('forms')
export class FormsController {
  private readonly logger = new Logger(FormsController.name);

  constructor(private readonly formsService: FormsService) {}

  @Get()
  listForms(): FormSummary[] {
    return this.formsService.listForms();
  }

  @Get(':formId')
  getForm(@Param('formId') formId: string): FormConfig {
    return this.formsService.getForm(formId);
  }

  @Post(':formId/submit')
  submitForm(@Param('formId') formId: string, @Body() dto: SubmitFormDto) {
    // Confirms the form exists (404s otherwise); persisting submissions is
    // out of scope for this chapter, so we just log and acknowledge.
    this.formsService.getForm(formId);
    this.logger.log(`Submission received for "${formId}": ${JSON.stringify(dto.data)}`);
    return { received: true };
  }
}
