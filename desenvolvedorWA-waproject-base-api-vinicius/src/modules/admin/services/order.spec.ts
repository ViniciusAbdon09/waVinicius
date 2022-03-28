import { IOrder } from 'modules/database/interfaces/order';

import { OrderRepository } from '../repositories/order';
import { OrderService } from './order';

describe('Orders Service', () => {
  let repository: OrderRepository;
  let service: OrderService;

  const order: IOrder = {
    description: 'Insert Order Test',
    quantity: 1,
    value: 1
  };

  beforeEach(async () => {
    repository = new OrderRepository();
    service = new OrderService(repository);
  });

  it('should able to create an order', async () => { 
    jest.spyOn(repository, 'insert').mockImplementationOnce(order => Promise.resolve({ ...order } as any));

    const result = await service.save(order);

    expect(result).not.toBeFalsy();
    expect(result).toEqual(order);
  });

  it('should able to remove a order', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValueOnce({ id: 2, isSysAdmin: () => false } as any);
    jest.spyOn(repository, 'remove').mockResolvedValueOnce({ id: 2 } as any);

   const order = await service.remove(2);
   expect(order).toHaveProperty('id')
  });
});
