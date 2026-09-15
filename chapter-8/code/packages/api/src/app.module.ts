import { Module }             from "@nestjs/common";
import { FormConfigModule }   from "./form-config/form-config.module";

@Module({
  imports: [FormConfigModule],
})
export class AppModule {}
