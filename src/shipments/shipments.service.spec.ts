import { describe, jest, beforeEach, it, expect } from '@jest/globals';
import { ShipmentsService } from './shipments.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShipmentEntity } from './entities/shipment.entity';
import { ShipmentRulesService } from './shipment-rules.service';
import { NotFoundException } from '@nestjs/common';

describe('ShipmentServiceTest', () => {
    let service: ShipmentsService;

    const RepositoryMock = {
        find: jest.fn<(options: any) => Promise<ShipmentEntity[] | null>>(),
        findOneBy: jest.fn<(options: any) => Promise<ShipmentEntity | null>>(),
        create: jest.fn(),
        save: jest.fn<(options: any) => Promise<ShipmentEntity | null>>(),
    };  
    const RuleServiceMock = {
        ensureCanBeDispatched: jest.fn()
    }

    beforeEach(async () => {
        jest.clearAllMocks();

        const moduleRef = await Test.createTestingModule({
            providers: [
                ShipmentsService,
                {
                    provide: getRepositoryToken(ShipmentEntity),
                    useValue: RepositoryMock,
                },
                {
                    provide: ShipmentRulesService,
                    useValue: RuleServiceMock,
                }
            ]
        }).compile();

        service = moduleRef.get(ShipmentsService)
    })

    it('is defined', async () => {
        expect(ShipmentsService).toBeDefined()
    });

    it('returns all shipments', async () => {

        const shipmentMock = [
        {
            id: 1,
            trackingCode: '123jeb',
            destination: 'somewhere idk',
            status: 'created'
        },
        {
            id: 2,
            trackingCode: '4123',
            destination: 'place',
            status: 'created'
        },
    ] as ShipmentEntity[];
        RepositoryMock.find.mockResolvedValue(shipmentMock)

        const result = await service.findAll();

        expect(result).toEqual(shipmentMock);
    })

    it('returns a shipment when the id exists',async () => {
        const shipmentMock = 
        {
            id: 7,
            trackingCode: '00x0000012',
            destination: 'beepboopland',
            status: 'created'
        } as ShipmentEntity;
        RepositoryMock.findOneBy.mockResolvedValue(shipmentMock)

        const result = await service.findOne(7);

        expect(result).toEqual(shipmentMock);

    })

    it('throws NotFoundException when the id does not exist',async () => {
        RepositoryMock.findOneBy.mockResolvedValue(null)
                
        await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException)
    })

    it('creates and saves a shipment',async () => {
        const shipmentMock = {
        trackingCode: 'SHIP-100',
        destination: 'Cali',
        } as ShipmentEntity;
        RepositoryMock.create.mockReturnValue(shipmentMock)
        RepositoryMock.save.mockResolvedValue(shipmentMock)
        
        const result = await service.create(shipmentMock)
        
        expect(result).toBeDefined;
        expect.objectContaining({status: 'created'});
        expect(RepositoryMock.save).toHaveBeenCalled();
    })

})