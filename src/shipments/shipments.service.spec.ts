import { describe, jest, beforeEach, it, expect } from '@jest/globals';
import { ShipmentsService } from './shipments.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShipmentEntity } from './entities/shipment.entity';
import { ShipmentRulesService } from './shipment-rules.service';

describe('ShipmentServiceTest', () => {
    let service: ShipmentsService;

    const RepositoryMock = {
        find: jest.fn(),
        findOneBy: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
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
    })
})