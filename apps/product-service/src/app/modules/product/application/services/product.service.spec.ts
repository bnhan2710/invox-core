import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { IProductRepository } from '../ports/product.port';
import { PRODUCT_REPOSITORY } from '../../product.di-tokens';
import { Product } from '@common/entities/product.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repository: jest.Mocked<IProductRepository>;

  const mockProduct: Product = {
    id: '1',
    sku: 'TEST-001',
    name: 'Test Product',
    description: 'Test Description',
    unit: 'pcs',
    price: 100,
    vatRate: 0.1,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Product;

  const mockProductRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get(PRODUCT_REPOSITORY);

    // clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createProductDto: Partial<Product> = {
      sku: 'TEST-001',
      name: 'Test Product',
      description: 'Test Description',
      unit: 'pcs',
      price: 100,
      vatRate: 0.1,
    };

    it('should successfully create a product when it does not exist', async () => {
      repository.exists.mockResolvedValue(false);
      repository.create.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);

      expect(repository.exists).toHaveBeenCalledWith(createProductDto.sku, createProductDto.name);
      expect(repository.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });

    it('should throw BadRequestException when product with same SKU exists', async () => {
      repository.exists.mockResolvedValue(true);

      await expect(service.create(createProductDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createProductDto)).rejects.toThrow(
        'Product with the same SKU or name already exists',
      );

      expect(repository.exists).toHaveBeenCalledWith(createProductDto.sku, createProductDto.name);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when product with same name exists', async () => {
      const duplicateNameDto: Partial<Product> = {
        sku: 'DIFFERENT-SKU',
        name: 'Test Product',
        price: 200,
      };

      repository.exists.mockResolvedValue(true);

      await expect(service.create(duplicateNameDto)).rejects.toThrow(BadRequestException);

      expect(repository.exists).toHaveBeenCalledWith(duplicateNameDto.sku, duplicateNameDto.name);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      repository.exists.mockResolvedValue(false);
      repository.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createProductDto)).rejects.toThrow('Database error');

      expect(repository.exists).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('getList', () => {
    it('should return an array of products', async () => {
      const mockProducts: Product[] = [
        mockProduct,
        {
          ...mockProduct,
          id: '2',
          sku: 'TEST-002',
          name: 'Test Product 2',
        } as Product,
      ];

      repository.findAll.mockResolvedValue(mockProducts);

      const result = await service.getList();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(2);
    });

    it('should return an empty array when no products exist', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.getList();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle repository errors', async () => {
      repository.findAll.mockRejectedValue(new Error('Database connection failed'));

      await expect(service.getList()).rejects.toThrow('Database connection failed');

      expect(repository.findAll).toHaveBeenCalled();
    });
  });
});
