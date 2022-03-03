import { PrismaClient, User, Item, Order, Prisma } from '@prisma/client';
import { NoId } from './types';

export const prisma = new PrismaClient();

export const getItemsWithQuery = async (query?: any /*🤮*/): Promise<Item[]> => {
  const where: Prisma.ItemWhereInput | undefined = query && Object.keys(query).length ?
    {

      orders: {
        every: query
      }
    } : undefined;

  const items = await prisma.item.findMany({
    include: {
      orders: {
        select: {
          user: true
        },
        where: {
          userId: query?.userId ?? undefined,
          id: query?.orderId ?? undefined,
        },
      },
    },
    where,
  });

  return items;
}

export const findUserBy = async (where: Prisma.UserWhereInput): Promise<User | null> => await prisma.user.findFirst({
  where,
  include: {
    orders: {
      include: {
        item: true
      }
    },
  }
});

export const findItemBy = async (where: Prisma.ItemWhereInput): Promise<Item | null> => await prisma.item.findFirst({
  where,
  include: {
    orders: {
      select: { user: true }
    }
  }
});

export type MinimisedOrder = Omit<Order, 'userId' | 'itemId'> & { item: Item, user: User };
export const findOrders = async (where?: Prisma.OrderWhereInput | undefined): Promise<MinimisedOrder[]> => await prisma.order.findMany({
  where,
  select: {
    id: true,
    quantity: true,
    item: true,
    user: true
  }
});


export const findOrderBy = async (where: Prisma.OrderWhereInput): Promise<MinimisedOrder | null> =>
  await prisma.order.findFirst({
    where,
    select: {
      id: true,
      item: true,
      quantity: true,
      user: true
    }
  });

export const createUser = async (user: NoId<User>) =>
  await prisma.user.create({ data: user });

export const createItem = async (item: NoId<Item>) =>
  await prisma.item.create({ data: item });

export type OrderWithUserItem = Order & { user: User, item: Item };

export const createOrder = async ({ userId, itemId, quantity }: NoId<Order>): Promise<OrderWithUserItem> =>
  await prisma.order.create({
    data: {
      quantity: quantity ?? 1,
      user: { connect: { id: userId } },
      item: { connect: { id: itemId } },
    },
    include: { user: true, item: true }
  });

export const updateOrder = async (where: Prisma.OrderWhereUniqueInput, data: Partial<Order>) =>
  prisma.order.update({ where, data });

export const deleteOrder = async (where: Prisma.OrderWhereUniqueInput) =>
  await prisma.order.delete({ where });
