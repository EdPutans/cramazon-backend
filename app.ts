import { User, Item, Order, Prisma } from '@prisma/client';
import { seed } from './seed';
import express from 'express';
import cors from 'cors';
import { ItemWithOrderers, Req, Res, NoId } from './types';
import { findItemBy, findOrderBy, findUserBy, getItemsWithQuery, prisma } from './queries';

const app = express();
app.use(express.json());
app.use(cors());



const findAllItems = async (shouldIncludePeople?: boolean): Promise<ItemWithOrderers[] | null> => await prisma.item.findMany({
  select: {
    id: true,
    title: true,
    image: true,
    orders: shouldIncludePeople
  },
});
const findOrders = async (where?: Prisma.OrderWhereInput | undefined): Promise<Order[] | null> => await prisma.order.findMany({
  where,
  include: {
    item: true,
    user: true
  }
});

const findItems = async (where: Prisma.ItemWhereInput): Promise<ItemWithOrderers[] | null> => await prisma.item.findMany({
  where: { ...where, }, include: { orders: true }
});



export const createItem = async (item: NoId<Item>): Promise<Item> => await prisma.item.create({ data: item });
export const createUser = async (user: NoId<User>): Promise<User> => await prisma.user.create({ data: user });

export const createOrder = async ({ userId, itemId }: NoId<Order>): Promise<Order> =>
  await prisma.order.create({
    data: {
      userId,
      itemId
    },
    include: { user: true, item: true }
  });


app.get('/items', async (req, res) => {
  const items = await getItemsWithQuery(req.query);

  res.send(items)
});

app.get('/items/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  const item = await findItemBy({ id });
  if (item) return res.send(item);

  res.send({ error: 'Item not found' });
});

app.get('/orders', async (req, res) => {
  const orders = await findOrders(req.query);

  return res.send(orders)
});

app.get('/orders/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  const order = await findOrderBy({ id });
  if (order) return res.send(order);

  res.send({ error: 'Order not found' });
});

// login, basically:
app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  const user = await findUserBy({ id });
  if (user) return res.send(user);

  res.send({ error: 'User not found' });
});

app.post('/items', async (req: Req, res: Res<Item>) => {
  const { title, image } = req.body;

  if (typeof image !== 'string') return res.send({ error: 'Image must be a string' });
  if (typeof title !== 'string') return res.send({ error: 'title must be a string' });

  const item = await createItem({ title, image });
  res.send({ data: item })
})

app.listen(3001, () => {
  console.log('listening on 3001 :)')
})

