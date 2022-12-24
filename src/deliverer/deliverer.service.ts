import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Message, throwCustomException } from 'src/errors/list.exception';
import { PasswordService } from 'src/shared/password.service';
import { CreateDelivererDto } from './dto/create-deliverer.dto';
import { Deliverer } from './entities/deliverer.entity';

@Injectable()
export class DelivererService {
  constructor(
    @Inject('DELIVERERS_REPOSITORY')
    private delivererRepository: typeof Deliverer,
    private passwordService: PasswordService,
  ) {}

  async create(createDelivererDto: CreateDelivererDto): Promise<Deliverer> {
    const { fullName, email, phone_number, password } = createDelivererDto;
    return this.delivererRepository.create<Deliverer>({
      fullName,
      email,
      phone_number,
      password,
    });
  }

  async findAll(): Promise<Deliverer[]> {
    return this.delivererRepository.findAll<Deliverer>();
  }

  async findOne(id: number): Promise<Deliverer> {
    if (!id) {
      throwCustomException(Message.IdCouldNotBeNull, HttpStatus.NOT_ACCEPTABLE);
    }
    return this.delivererRepository.findByPk<Deliverer>(id);
  }

  async update(
    id: number,
    attrs: Partial<Deliverer>,
  ): Promise<Partial<Deliverer>> {
    const user = await this.findOne(id);
    if (!user) {
      throwCustomException(Message.UserNotFound, HttpStatus.NOT_FOUND);
    }
    const updatedUserEntity = Object.assign(user, attrs);
    if (attrs.password) {
      updatedUserEntity.password = await this.passwordService.toHash(
        attrs.password,
      );
    }
    try {
      console.log(updatedUserEntity.dataValues);
      const updateStatus = await this.delivererRepository.update(
        updatedUserEntity.dataValues,
        {
          where: {
            id,
          },
        },
      );
      if (updateStatus[0] > 0) {
        return updatedUserEntity;
      } else {
        throwCustomException(Message.UpdateFailed, HttpStatus.CONFLICT);
      }
    } catch (error) {
      throwCustomException(Message.DuplicatedEmail, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throwCustomException(Message.UserNotFound, HttpStatus.NOT_FOUND);
    }
    const status = await this.delivererRepository.destroy<Deliverer>({
      where: { id: user.id },
    });
    if (status > 0) {
      return user;
    } else {
      throwCustomException(Message.RemoveFailed, HttpStatus.CONFLICT);
    }
  }
}
