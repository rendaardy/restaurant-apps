import 'reflect-metadata';

import { FavoriteService } from '../src/scripts/shared/favorite-service';
import { Restaurant } from '../src/scripts/model/restaurant';
import { data } from './helpers/data';

describe('Favorite service', () => {
  let favoriteService: FavoriteService;
  let dummyRestaurants: Restaurant[];

  beforeEach(() => {
    favoriteService = new FavoriteService();
    dummyRestaurants = data.dummyRestaurants;
  });

  it('should get all restaurants from database', async () => {
    spyOn(favoriteService, 'getRestaurants').and.resolveTo(dummyRestaurants);

    await expectAsync(favoriteService.getRestaurants()).toBeResolvedTo(dummyRestaurants);
    expect(favoriteService.getRestaurants).toHaveBeenCalled();
  });

  it('should fail to get restaurants from database', async () => {
    spyOn(favoriteService, 'getRestaurants').and.rejectWith(new Error('failed to get data'));

    await expectAsync(favoriteService.getRestaurants()).toBeRejectedWithError('failed to get data');
    expect(favoriteService.getRestaurants).toHaveBeenCalled();
  });

  it('should find restaurants with certain query', async () => {
    const query = 'Warung';
    const filteredRestaurants = dummyRestaurants.filter((r) => r.name.includes(query));

    spyOn(favoriteService, 'getRestaurants').withArgs(query).and.resolveTo(filteredRestaurants);

    await expectAsync(favoriteService.getRestaurants(query)).toBeResolvedTo(filteredRestaurants);
    expect(favoriteService.getRestaurants).toHaveBeenCalledWith(query);
  });

  it('should fail to find restaurants with certain query', async () => {
    const query = 'Warung';

    spyOn(favoriteService, 'getRestaurants')
      .withArgs(query)
      .and.rejectWith(new Error('failed to get data'));

    await expectAsync(favoriteService.getRestaurants(query)).toBeRejectedWithError(
      'failed to get data'
    );
    expect(favoriteService.getRestaurants).toHaveBeenCalledWith(query);
  });

  it('should get a restaurant from database', async () => {
    spyOn(favoriteService, 'getRestaurant').withArgs('1').and.resolveTo(dummyRestaurants[0]);

    await expectAsync(favoriteService.getRestaurant('1')).toBeResolvedTo(dummyRestaurants[0]);
    expect(favoriteService.getRestaurant).toHaveBeenCalledWith('1');
  });

  it('should fail to get a restaurant from database', async () => {
    spyOn(favoriteService, 'getRestaurant')
      .withArgs('1')
      .and.rejectWith(new Error('failed to get data'));

    await expectAsync(favoriteService.getRestaurant('1')).toBeRejectedWithError(
      'failed to get data'
    );
    expect(favoriteService.getRestaurant).toHaveBeenCalledWith('1');
  });

  it('should store a restaurant to database', async () => {
    spyOn(favoriteService, 'putRestaurant').withArgs(dummyRestaurants[0]).and.resolveTo();

    await expectAsync(favoriteService.putRestaurant(dummyRestaurants[0])).toBeResolved();
    expect(favoriteService.putRestaurant).toHaveBeenCalledWith(dummyRestaurants[0]);
  });

  it('shoould fail to store a restaurant to database', async () => {
    spyOn(favoriteService, 'putRestaurant')
      .withArgs(dummyRestaurants[0])
      .and.rejectWith(new Error('failed to store data'));

    await expectAsync(favoriteService.putRestaurant(dummyRestaurants[0])).toBeRejectedWithError(
      'failed to store data'
    );
    expect(favoriteService.putRestaurant).toHaveBeenCalledWith(dummyRestaurants[0]);
  });

  it('should delete a restaurant from database', async () => {
    spyOn(favoriteService, 'deleteRestaurant').withArgs('1').and.resolveTo();

    await expectAsync(favoriteService.deleteRestaurant('1')).toBeResolved();
    expect(favoriteService.deleteRestaurant).toHaveBeenCalledWith('1');
  });

  it('should fail to delete a restaurant from database', async () => {
    spyOn(favoriteService, 'deleteRestaurant')
      .withArgs('1')
      .and.rejectWith(new Error('failed to delete data'));

    await expectAsync(favoriteService.deleteRestaurant('1')).toBeRejectedWithError(
      'failed to delete data'
    );
    expect(favoriteService.deleteRestaurant).toHaveBeenCalledWith('1');
  });
});
