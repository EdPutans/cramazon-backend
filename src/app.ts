import { User, Item, Order } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import { Req, Res } from './types';
import { createItem, createOrder, createUser, deleteOrder, findItemBy, findOrderBy, findOrders, findUserBy, getItemsWithQuery, MinimisedOrder, OrderWithUserItem, prisma, updateOrder } from './queries';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/items', async (req, res: Res<Item[]>) => {
  const items = await getItemsWithQuery(req.query);

  res.send({ data: items })
});

app.get('/items/:id', async (req, res: Res<Item>) => {
  const id = parseInt(req.params.id);
  const item = await findItemBy({ id });

  if (!item) return res.send({ error: 'Item not found' });

  res.send({ data: item });

});

app.get('/orders', async (req, res: Res<MinimisedOrder[]>) => {
  const orders: MinimisedOrder[] | null = await findOrders(req.query);

  if (!orders) return res.status(500).send({ error: "Something went wrong retrieving orders." })

  return res.send({ data: orders })
});

app.get('/orders/:id', async (req, res: Res<MinimisedOrder>) => {
  const id = parseInt(req.params.id);

  const order: MinimisedOrder | null = await findOrderBy({ id });

  if (order) return res.send({ data: order });

  res.send({ error: 'Order not found' });
});

app.get('/users/:id', async (req, res: Res<User>) => {
  const id = parseInt(req.params.id);

  const user = await findUserBy({ id });
  if (user) return res.send({ data: user });

  res.send({ error: 'User not found' });
});

app.post('/users/login', async (req: Req, res: Res<User>) => {
  const { email } = req.body;

  if (typeof email !== 'string') return res.send({ error: 'Email must be a string' });

  const user = await findUserBy({ email });
  if (user) return res.send({ data: user });

  res.send({ error: 'User not found' });
})

app.post('/users/register', async (req: Req<User>, res) => {
  const { email, name } = req.body;

  if (typeof email !== 'string') return res.send({ error: 'Email must be a string' });
  if (typeof name !== 'string') return res.send({ error: 'Name must be a string' });

  const userExists = await findUserBy({ email });
  if (userExists) return res.send({ error: 'User already exists' });

  const user = await createUser({ email, name });

  res.send({ data: user })
})

app.post('/items', async (req: Req, res: Res<Item>) => {
  const { title, image } = req.body;

  if (typeof image !== 'string') return res.send({ error: 'Image must be a string' });
  if (typeof title !== 'string') return res.send({ error: 'Title must be a string' });

  const item = await createItem({ title, image });
  res.send({ data: item })
})

app.post('/orders', async (req: Req, res: Res<OrderWithUserItem>) => {
  const { userId, itemId, quantity } = req.body;

  if (!quantity) return res.send({ error: 'Quantity must be present' });
  if (!userId) return res.send({ error: 'UserId must be present' });
  if (!itemId) return res.send({ error: 'ItemId must be present' });

  const order = await createOrder({ userId, itemId, quantity });
  if (!order) return res.send({ error: 'Order could not be created' });

  res.send({ data: order })
})

app.patch('/orders/:id', async (req: Req<{ id: string }, { userId: string, itemId: string }>, res: Res<Order>) => {
  const { id } = req.params;
  const { userId, itemId } = req.body;

  const updatedOrder = await updateOrder({ id: Number(id) }, { userId, itemId });
  if (!updatedOrder) return res.status(500).send({ error: 'Order could not be created' });

  res.send({ data: updatedOrder })
})

app.delete('/orders/:id', async (req: Req<{ id: string }>, res: Res<string>) => {
  const { id } = req.params;
  const deletedOrder = await deleteOrder({ id: Number(id) });

  if (!deletedOrder) return res.status(404).send({ error: 'Order could not be deleted' });

  res.send({ data: "Order deleted successfully" });
})

const PORT = 4000;

app.listen(PORT, async () => {
  console.log(`listening on ${PORT} :)`)
})

