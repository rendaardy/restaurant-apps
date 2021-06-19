import { Restaurant } from '../model/restaurant';

export interface IRestaurantService {
  getRestaurants(query?: string): Promise<Restaurant[]>;
  getRestaurant(id: string): Promise<Restaurant>;
}

export interface IFavoriteService extends IRestaurantService {
  putRestaurant(restaurant: Restaurant): Promise<void>;
  deleteRestaurant(id: string): Promise<void>;
}

export const TYPES = {
  RESTAURANT_SERVICE: Symbol.for('RestaurantService'),
  FAVORITE_SERVICE: Symbol.for('FavoriteService'),
};
