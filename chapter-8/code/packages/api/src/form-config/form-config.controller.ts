import {
  Body, Controller, Get, HttpCode, Param, Post, BadRequestException,
} from "@nestjs/common";
import { buildZodSchema }    from "./buildZodSchema";
import { FormConfigService } from "./form-config.service";
import { SubmitFormDto }     from "./dto/submit-form.dto";
import type { FormConfig }   from "@formforge/types";

@Controller("forms")
export class FormConfigController {
  constructor(private readonly svc: FormConfigService) {}

  @Get()
  listForms() { return this.svc.listConfigs(); }

  @Get(":formId")
  getForm(@Param("formId") formId: string): FormConfig { return this.svc.getConfig(formId); }

  @Post(":formId/submit")
  @HttpCode(201)
  submitForm(@Param("formId") formId: string, @Body() dto: SubmitFormDto) {
    // SubmitFormDto only confirms `data` is an object. Validate its actual
    // contents against this specific form's own config, using the same
    // shared validation core (@formforge/types' buildZodSchemaCore) the
    // frontend builds on, so a request that skips the client (curl, a bug
    // in the form, a stale client) can't submit invalid or missing
    // required fields.
    const config = this.svc.getConfig(formId);
    const schema = buildZodSchema(config);
    const result = schema.safeParse(dto.data);
    if (!result.success) {
      throw new BadRequestException({
        message: "Submitted values do not match the form's configuration.",
        errors: result.error.issues.map(i => ({ path: i.path.join("."), message: i.message })),
      });
    }
    return { success: true, formId, submittedAt: new Date().toISOString() };
  }
}
