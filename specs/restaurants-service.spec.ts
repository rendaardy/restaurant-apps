import 'reflect-metadata';
import 'jasmine-ajax';

// @ts-ignore
import { fetch as fetchPolyfill } from 'whatwg-fetch';

import { RestaurantService } from '../src/scripts/shared/restaurants-service';
import { config } from '../src/scripts/shared/config';
import { data } from './helpers/data';
import { Restaurant } from '../src/scripts/model/restaurant';

describe('Restaurant service', () => {
  let originalFetch: any;
  let restaurantService: RestaurantService;

  beforeEach(() => {
    originalFetch = (window as any).fetch;
    (window as any).fetch = fetchPolyfill;

    jasmine.Ajax.install();

    restaurantService = new RestaurantService();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
    (window as any).fetch = originalFetch;
  });

  it('should get all restaurants from the server', async () => {
    jasmine.Ajax.stubRequest(`${config.baseUrl}/list`).andReturn({
      status: 200,
      contentType: 'application/json',
      responseJSON: {
        restaurants: data.dummyRestaurants,
      },
    });

    const result: Restaurant[] = await restaurantService.getRestaurants();

    expect(jasmine.Ajax.requests.mostRecent().status).toEqual(200);
    expect(result.length).toEqual(data.dummyRestaurants.length);
  });

  it('should fail to get all restaurants from the server', async () => {
    jasmine.Ajax.stubRequest(`${config.baseUrl}/list`).andReturn({
      status: 404,
      contentType: 'application/json',
      responseJSON: {
        error: true,
        message: 'not found',
        restaurants: [],
      },
    });

    await expectAsync(restaurantService.getRestaurants()).toBeRejected();

    expect(jasmine.Ajax.requests.mostRecent().status).toEqual(404);
  });

  it('should get a restaurant from the server', async () => {
    jasmine.Ajax.stubRequest(`${config.baseUrl}/detail/1`).andReturn({
      status: 200,
      contentType: 'application/json',
      responseJSON: {
        restaurant: data.dummyRestaurants[0],
      },
    });

    const result: Restaurant = await restaurantService.getRestaurant('1');

    expect(jasmine.Ajax.requests.mostRecent().status).toEqual(200);
    expect(result.name).toEqual(data.dummyRestaurants[0].name);
  });

  it('should fail to get a restaurant from the server', async () => {
    jasmine.Ajax.stubRequest(`${config.baseUrl}/detail/1`).andReturn({
      status: 404,
      contentType: 'application/json',
      responseJSON: {
        error: true,
        message: 'not found',
        restaurant: null,
      },
    });

    await expectAsync(restaurantService.getRestaurant('1')).toBeRejected();

    expect(jasmine.Ajax.requests.mostRecent().status).toEqual(404);
  });

  it('should find restaurants which contains "Warung" on the server', async () => {
    const query = 'Warung';
    const filteredRestaurants = data.dummyRestaurants.filter((r) => r.name.includes(query));

    jasmine.Ajax.stubRequest(`${config.baseUrl}/search?q=${query}`).andReturn({
      status: 200,
      contentType: 'application/json',
      responseJSON: {
        restaurants: filteredRestaurants,
      },
    });

    const result: Restaurant[] = await restaurantService.findRestaurants('Warung');

    expect(jasmine.Ajax.requests.mostRecent().status).toEqual(200);
    expect(result.length).toEqual(filteredRestaurants.length);
  });

  it('should throw an error when restaurant being search is not on the server', async () => {
    const query = 'Warung';

    jasmine.Ajax.stubRequest(`${config.baseUrl}/search?q=${query}`).andError({
      status: 404,
    });

    await expectAsync(restaurantService.findRestaurants(query)).toBeRejected();

    expect(jasmine.Ajax.requests.mostRecent().status).toEqual(404);
  });

  it('should send a review to the server', async () => {
    jasmine.Ajax.stubRequest(`${config.baseUrl}/review`).andReturn({
      status: 200,
      contentType: 'application/json',
      responseJSON: {
        customerReviews: data.customerReviews,
      },
    });

    await expectAsync(restaurantService.postReview(data.customerReviews[0])).toBeResolved();

    expect(jasmine.Ajax.requests.mostRecent().status).toEqual(200);
  });

  it('should fail to send a review to the server', async () => {
    jasmine.Ajax.stubRequest(`${config.baseUrl}/review`).andReturn({
      status: 500,
      contentType: 'application/json',
      responseJSON: {
        error: true,
        message: 'internal server error',
        customerReviews: [],
      },
    });

    await expectAsync(restaurantService.postReview(data.customerReviews[0])).toBeRejected();

    expect(jasmine.Ajax.requests.mostRecent().status).toEqual(500);
  });
});
