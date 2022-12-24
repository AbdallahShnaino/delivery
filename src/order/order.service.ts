import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Message, throwCustomException } from 'src/errors/list.exception';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDERS_REPOSITORY')
    private ordersRepository: typeof Order,
  ) {}

  async create(
    clientId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const {
      name,
      description,
      dropoffLocLatitude,
      dropoffLocLongitude,
      pickupLocLatitude,
      pickupLocLongitude,
      quantity,
    } = createOrderDto;

    return this.ordersRepository.create<Order>({
      delivererId: -1,
      state: 'wait for deliverer',
      clientId,
      name,
      description,
      dropoffLocLatitude,
      dropoffLocLongitude,
      pickupLocLatitude,
      pickupLocLongitude,
      quantity,
    });

    // notify all deliverers
  }

  async findAll(clientId: number): Promise<Order[]> {
    return this.ordersRepository.findAll({ where: { clientId } });
  }

  async findOne(id: number): Promise<Order> {
    return this.ordersRepository.findByPk(id);
  }

  async update(id: number, attrs: Partial<Order>): Promise<Partial<Order>> {
    const order = await this.findOne(id);
    if (!order) {
      throwCustomException(Message.UpdateFailed, HttpStatus.NOT_FOUND);
    }
    const updatedOrderEntity = Object.assign(order, attrs);

    try {
      console.log(updatedOrderEntity.dataValues);
      const updateStatus = await this.ordersRepository.update(
        updatedOrderEntity.dataValues,
        {
          where: {
            id,
          },
        },
      );
      if (updateStatus[0] > 0) {
        return updatedOrderEntity;
      } else {
        throwCustomException(Message.UpdateFailed, HttpStatus.CONFLICT);
      }
    } catch (error) {
      throwCustomException(Message.DuplicatedEmail, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    if (!order) {
      throwCustomException(Message.RemoveFailed, HttpStatus.NOT_FOUND);
    }
    const status = await this.ordersRepository.destroy<Order>({
      where: { id: order.id },
    });
    if (status > 0) {
      return order;
    } else {
      throwCustomException(Message.RemoveFailed, HttpStatus.CONFLICT);
    }
  }
}
