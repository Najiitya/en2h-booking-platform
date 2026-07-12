import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';

describe('BookingsService', () => {
  let service: BookingsService;

  const mockBookingsRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(booking => Promise.resolve({ id: 'uuid-book', ...booking })),
    find: jest.fn().mockImplementation(() => Promise.resolve([{ id: 'uuid-book', status: 'pending' }])),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => Promise.resolve({ id, status: 'pending' })),
    remove: jest.fn().mockImplementation(() => Promise.resolve()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingsRepository,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a booking successfully', async () => {
    const dto = { userId: 'u1', serviceId: 's1', appointmentDate: '2026-07-15', status: 'pending' };
    expect(await service.create(dto)).toEqual({ id: 'uuid-book', ...dto });
  });

  it('should update a booking', async () => {
    const dto = { status: 'confirmed' };
    expect(await service.update('uuid-book', dto)).toEqual({ id: 'uuid-book', status: 'confirmed' });
  });
});