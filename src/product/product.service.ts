import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService,
  ) {
  }

  async create(data: CreateProductDto): Promise<Product> {
    try {
      return this.prisma.product.create({ data });
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Unknown error while creating product',
      );
    }
  }

  async findAll(): Promise<string | undefined> {
    try {
      const products: Product[] = await this.prisma.product.findMany();

      if (!products) throw new NotFoundException('Products not found');

      const prompt = `В мене є такі товари: ${products
        .map(({ name, description, quantity }: Product) => {
          return `${name} - ${description} - ${quantity}`;
        })
        .join(
          ',',
        )}. Напиши опис які товари саме доступні та привабливо для перспективи покупки. Коротко і зрозуміло. Українською`;

      return await this.geminiService.generateText(prompt);
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Unknown error while getting products',
      );
    }
  }
}
