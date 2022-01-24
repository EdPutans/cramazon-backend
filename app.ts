import { PrismaClient, User, Item } from '@prisma/client';

import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

const selectAllHobbies = async (shouldIncludeUsers?: boolean): Promise<Hobby | null> => await prisma.hobby.findMany({
  where,
  include: {
    users: !!shouldIncludeUsers,
  }
});

const findUserById = async (id: number): Promise<User | null> => await prisma.user.findFirst({
  where: { id },
  include: {
    orders: true
  }
});

const findItemById = async (id: number, shouldIncludePeople?: boolean): Promise<Item | null> => await prisma.item.findFirst({
  where: { id },
  include: {
    orderers: shouldIncludePeople
  }
});

app.get('/items', async () => {
  await prisma.item.findMany()
});

app.get('/items/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  const item = await findItemById(id, false);
  if (item) return res.send(item);

  res.send({ error: 'Item not found' });
});

app.get('/user/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  const user = await findUserById(id);
  if (user) return res.send(user);

  res.send({ error: 'User not found' });
});



app.listen(3001, () => {
  console.log('listening on 3001 :)')
})
