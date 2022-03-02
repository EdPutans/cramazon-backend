import { PrismaClient, User, Item, Order, Prisma } from '@prisma/client';
import { NoId } from './types';

export const prisma = new PrismaClient();

export const getItemsWithQuery = async (query?: any /*🤮*/): Promise<Item[]> => {
  const where: Object | undefined = query && Object.keys(query) ?
    {
      orders: {
        every: {
          query
        }
      }
    } : undefined;

  const items = await prisma.item.findMany({
    include: {
      orders: {
        include: {
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
    orders: true
  }
});

export const findItemBy = async (where: Prisma.ItemWhereInput): Promise<Item | null> => await prisma.item.findFirst({
  where,
  include: {
    orders: {
      include: { user: true }
    }
  }
});

export const findOrderBy = async (where: Prisma.OrderWhereInput): Promise<Order | null> =>
  await prisma.order.findFirst({
    where,
    include: {
      item: true,
      user: true
    }
  });

export const createUser = async (user: NoId<User>) =>
  await prisma.user.create({ data: user });

export const createItem = async (item: NoId<Item>) =>
  await prisma.item.create({ data: item });

export const createOrder = async ({ userId, itemId }: NoId<Order>) =>
  await prisma.order.create({
    data: {
      user: { connect: { id: userId } },
      item: { connect: { id: itemId } },
    },
    include: { user: true, item: true }
  });

