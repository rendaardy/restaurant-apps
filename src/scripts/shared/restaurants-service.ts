import { injectable } from 'inversify';
import { Restaurant, CustomerReview } from '../model/restaurant';
import { IRestaurantService } from './restaurant-interface';
import { config } from './config';

@injectable()
export class RestaurantService implements IRestaurantService {
  async getRestaurants(): Promise<Restaurant[]> {
    const response = await fetch(`${config.baseUrl}/list`);

    if (!response.ok) {
      throw new Error('Failed to fetch list of restaurants');
    }

    const json = await response.json();
    return json.restaurants.map((restaurant: any) => Restaurant.fromJSON(restaurant));
  }

  async getRestaurant(id: string): Promise<Restaurant> {
    const response = await fetch(`${config.baseUrl}/detail/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch a restaurant');
    }

    const json = await response.json();
    return Restaurant.fromJSON(json.restaurant);
  }

  async findRestaurants(query: string): Promise<Restaurant[]> {
    const response = await fetch(`${config.baseUrl}/search?q=${query.trim()}`);

    if (!response.ok) {
      throw new Error('Restaurant not found');
    }

    const json = await response.json();
    return json.restaurants.map((restaurant: any) => Restaurant.fromJSON(restaurant));
  }

  async postReview(review: CustomerReview): Promise<CustomerReview[]> {
    const response = await fetch(`${config.baseUrl}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': config.apiKey,
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      throw new Error('Failed to post review');
    }

    const json = await response.json();
    return json.customerReviews;
  }
}
