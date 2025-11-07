import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ProductModule } from './product/product.module';

@Module({
  providers: [PrismaService],
  imports: [ProductModule],
})
export class AppModule {}
