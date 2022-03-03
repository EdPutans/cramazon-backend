import { createOrder, prisma } from './queries';

export const seed = async () => {
  await prisma.order.deleteMany({})
  await prisma.item.deleteMany({})
  await prisma.user.deleteMany({})

  const steve = await prisma.user.create({ data: { name: "Steve", email: 'steve@dab.com' } });
  const ed = await prisma.user.create({ data: { name: "Ed", email: 'ed@dab.com' } });
  const nico = await prisma.user.create({ data: { name: "Nico", email: 'nico@dab.com' } });
  const kushtrim = await prisma.user.create({ data: { name: "Kushtrim", email: 'kushtrim@dab.com' } });

  const banana = await prisma.item.create({ data: { title: 'banana', image: 'banana.png' } });
  const mango = await prisma.item.create({ data: { title: 'mango', image: 'mango.png' } })
  const apple = await prisma.item.create({ data: { title: 'apple', image: 'apple.png' } })

  const order1 = await createOrder({ itemId: banana.id, userId: steve.id, quantity: 1 });
  const order2 = await createOrder({ itemId: mango.id, userId: steve.id, quantity: 1 });
  const order3 = await createOrder({ itemId: mango.id, userId: ed.id, quantity: 2 });

  return {
    steve,
    ed,
    nico,
    kushtrim,
    banana,
    mango,
    apple,
    order1,
    order2,
    order3
  }
}