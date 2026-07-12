import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';

describe('ServicesService', () => {
  let service: ServicesService;

  const mockServicesRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(service => Promise.resolve({ id: 'uuid-1234', ...service })),
    find: jest.fn().mockImplementation(() => Promise.resolve([{ id: 'uuid-1234', name: 'Test Service' }])),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => Promise.resolve({ id, name: 'Test Service' })),
    remove: jest.fn().mockImplementation(() => Promise.resolve()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useValue: mockServicesRepository,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a service successfully', async () => {
    const dto = { name: 'VIP Setup', description: 'Fast track', price: 1000, duration: 30 };
    expect(await service.create(dto)).toEqual({ id: 'uuid-1234', ...dto });
  });

  it('should return an array of services', async () => {
    expect(await service.findAll()).toEqual([{ id: 'uuid-1234', name: 'Test Service' }]);
  });
});