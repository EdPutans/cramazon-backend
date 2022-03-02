import { test, describe, expect, it, beforeAll } from 'vitest'
import { getItemsWithQuery, prisma } from './queries'
import { seed } from './seed';
import { ItemWithOrderers } from './types';

test('should work as expected', () => {
  expect(Math.sqrt(4)).toBe(2);
})

describe('getItemsWithQuery', async () => {
  const seeder = await seed();
  const { banana, mango, apple, order1, order2, order3, ed, steve, } = seeder;

  it('returns all items when no params given', async () => {
    const result: ItemWithOrderers[] = await getItemsWithQuery()

    expect(result).toEqual([{
      id: banana.id,
      image: banana.image,
      title: banana.title,
      orders: [{
        id: order1.id,
        userId: steve.id,
        itemId: banana.id,
        user: steve
      }],
    },
    {
      id: mango.id,
      image: mango.image,
      title: mango.title,
      orders: [{
        id: order2.id,
        itemId: mango.id,
        userId: steve.id,
        user: steve
      },
      {
        id: order3.id,
        itemId: mango.id,
        userId: ed.id,
        user: ed
      }],
    }, {
      title: apple.title,
      image: apple.image,
      id: apple.id,
      orders: [],
    }]);

  })

  it('returns items Steven ordered when given Steves id as userId', async () => {
    const result = await getItemsWithQuery({ userId: steve.id.toString() })

    expect(result).toEqual([{
      title: 'banana',
      id: banana.id,
      image: 'banana.png',
      orders: [{
        id: order1.id,
        userId: steve.id,
        itemId: banana.id,
        user: steve
      }],
    },
    {
      id: mango.id,
      image: "mango.png",
      title: "mango",
      orders: [{
        id: order2.id,
        itemId: mango.id,
        userId: steve.id,
        user: steve
      }],
    }]);
  });


  it('returns single item for orderId ', async () => {
    const result = await getItemsWithQuery({ orderId: order1.id.toString() })

    expect(result).toEqual([{
      title: 'banana',
      id: banana.id,
      image: 'banana.png',
      orders: [{
        id: order1.id,
        userId: steve.id,
        itemId: banana.id,
        user: steve
      }],
    }]);
  });
});
