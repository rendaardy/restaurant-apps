import { DBSchema, IDBPDatabase } from 'idb';
import { injectable } from 'inversify';

import { Restaurant } from '../model/restaurant';
import { IFavoriteService } from './restaurant-interface';
import { config } from '../shared/config';

interface RestaurantSchema extends DBSchema {
  restaurant: {
    key: string;
    value: Restaurant;
  };
}

async function getDb(): Promise<IDBPDatabase<RestaurantSchema>> {
  const { openDB } = await import(/* webpackChunkName: "idb" */ 'idb');
  const database = await openDB<RestaurantSchema>(config.dbName, config.dbVersion, {
    upgrade(db: IDBPDatabase<RestaurantSchema>) {
      db.createObjectStore('restaurant', { keyPath: 'id' });
    },
  });

  return database;
}

@injectable()
export class FavoriteService implements IFavoriteService {
  async getRestaurant(id: string): Promise<Restaurant> {
    const db = await getDb();
    const result = await db.get('restaurant', id);

    if (!result) {
      throw new Error('megabucket: restaurant is not found');
    }

    return result;
  }

  async getRestaurants(query?: string): Promise<Restaurant[]> {
    const db = await getDb();
    let result: Restaurant[];

    if (query) {
      result = await db.getAll('restaurant', query);
    } else {
      result = await db.getAll('restaurant');
    }

    if (!result) {
      throw new Error('megabucket: restaurants are not found');
    }

    return result;
  }

  async hasRestaurant(id: string): Promise<boolean> {
    try {
      await this.getRestaurant(id);
      return true;
    } catch {
      return false;
    }
  }

  async putRestaurant(restaurant: Restaurant): Promise<void> {
    const db = await getDb();
    await db.put('restaurant', restaurant);
  }

  async deleteRestaurant(id: string): Promise<void> {
    const db = await getDb();
    await db.delete('restaurant', id);
  }
}
