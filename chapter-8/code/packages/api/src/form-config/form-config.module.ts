import { Module }               from "@nestjs/common";
import { FormConfigController } from "./form-config.controller";
import { FormConfigService }    from "./form-config.service";

@Module({
  controllers: [FormConfigController],
  providers: [FormConfigService],
})
export class FormConfigModule {}
