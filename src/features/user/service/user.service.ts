import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { User } from '../schema/user.schema';
import { randomString } from '../../../shared/utils/random-string';
import { UserGateway } from '../gateway/user.gateway';
import { Socket } from 'socket.io';
import { SocketConnectionService } from './socket-connection.service';
import { STATUS } from 'src/shared/constants/status';
import { handleConvertDataObject } from 'src/utils';

@Injectable()
export class UserService {
  private blockedFields: (keyof User)[] = [
    'password',
    'sessionToken',
    // 'email',
    'facebookId',
    'googleId',
    'appleId',
    '_id',
  ];

  unpopulatedFields = '-' + this.blockedFields.join(' -');

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => UserGateway)) private userGateway: UserGateway,
    private socketConnectionService: SocketConnectionService,
  ) {}

  getUserByName(name: string, status: number = STATUS.ACTIVE) {
    const username = { $regex: new RegExp(`^${name}$`, 'i') };

    return this.userModel.findOne({ username, status });
  }

  async validateUserByName(username: string) {
    const user = await this.getUserByName(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  getUserByEmail(mail: string, status: number = STATUS.ACTIVE) {
    const email = { $regex: new RegExp(`^${mail}$`, 'i') };

    return this.userModel.findOne({ email, status });
  }

  async validateUserByEmail(email: string) {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  getUserBy(filter: FilterQuery<User>) {
    return this.userModel.findOne(filter);
  }

  getUserByGoogleId(id: string) {
    return this.userModel.findOne({ googleId: id });
  }

  getUserById(id: ObjectId | string) {
    return this.userModel.findById(id);
  }

  async validateUserById(id: string, status: number = STATUS.ACTIVE) {
    const user = await this.getUserBy({ _id: id, status });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  getOnlineUsers() {
    return this.userModel.find({ online: true });
  }

  async subscribeSocket(socket: Socket, user: User) {
    await this.socketConnectionService.create(socket, user);

    return socket.join(`user_${user._id}`);
  }

  async unsubscribeSocket(socket: Socket, user: User) {
    await this.socketConnectionService.delete(socket);

    return socket.leave(`user_${user._id}`);
  }

  sendMessage<T>(user: User, event: string, message?: T) {
    return this.userGateway.server.to(`user_${user._id}`).emit(event, message);
  }

  sendMessageExcept<T>(except: Socket, user: User, event: string, message: T) {
    return except.broadcast.to(`user_${user._id}`).emit(event, message);
  }

  async generateUsername(base: string) {
    const name = base.replace(/\s/g, '');

    if (!(await this.getUserByName(name))) {
      return name;
    }

    return this.generateUsername(name + randomString(1));
  }

  async getUser(username: string) {
    return (
      (await this.getUserByName(username)) ??
      (await this.getUserByEmail(username))
    );
  }

  filterUser(user: User, allowedFields: (keyof User)[] = []) {
    const userObject = user.toObject({ virtuals: true });

    for (const field of this.blockedFields) {
      if (allowedFields.includes(field)) {
        continue;
      }

      delete userObject[field];
    }

    return userObject;
  }

  async create(body: Partial<User>) {
    const user = await this.userModel.create(body);

    user.generateSessionToken();

    return user.save();
  }

  async getListUser(
    allowedFields: (keyof User)[] = [],
    status: STATUS = STATUS.ACTIVE,
  ) {
    const userObject = await this.userModel.find({ status });
    console.log(11111, userObject, status);
    return userObject.map(it =>
      handleConvertDataObject(it, allowedFields, this.blockedFields),
    );
  }

  async deleteUsers(ids: string[]) {
    return await this.userModel.updateMany(
      { _id: ids },
      { status: STATUS.INACTIVE },
    );
  }
}
