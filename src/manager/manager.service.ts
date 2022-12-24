import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Message, throwCustomException } from 'src/errors/list.exception';
import { PasswordService } from 'src/shared/password.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { Manager } from './entities/manager.entity';

@Injectable()
export class ManagerService {
  constructor(
    @Inject('MANAGERS_REPOSITORY')
    private managerRepository: typeof Manager,
    private passwordService: PasswordService,
  ) {}

  async create(createManagerDto: CreateManagerDto): Promise<Manager> {
    const { fullName, email, phone_number, password } = createManagerDto;
    return this.managerRepository.create<Manager>({
      fullName,
      email,
      phone_number,
      password,
    });
  }

  async findAll(): Promise<Manager[]> {
    return this.managerRepository.findAll<Manager>();
  }

  async findOne(id: number): Promise<Manager> {
    if (!id) {
      throwCustomException(Message.IdCouldNotBeNull, HttpStatus.NOT_ACCEPTABLE);
    }
    return this.managerRepository.findByPk<Manager>(id);
  }

  async update(id: number, attrs: Partial<Manager>): Promise<Partial<Manager>> {
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
      const updateStatus = await this.managerRepository.update(
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
    const status = await this.managerRepository.destroy<Manager>({
      where: { id: user.id },
    });
    if (status > 0) {
      return user;
    } else {
      throwCustomException(Message.RemoveFailed, HttpStatus.CONFLICT);
    }
  }
}
