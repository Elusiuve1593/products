import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../gemini/gemini.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, GeminiService],
})
export class ProductModule {}
