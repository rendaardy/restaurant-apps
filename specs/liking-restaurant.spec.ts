import 'reflect-metadata';

import '../src/scripts/pages/detailpage';

import DetailPage from '../src/scripts/pages/detailpage';
import { RestaurantService } from '../src/scripts/shared/restaurants-service';
import { FavoriteService } from '../src/scripts/shared/favorite-service';
import { Restaurant } from '../src/scripts/model/restaurant';

describe('Detail page', () => {
  let restaurantService: RestaurantService;
  let favoriteService: FavoriteService;
  let detailPage: DetailPage;
  let dummyRestaurant: Restaurant;

  beforeEach(() => {
    restaurantService = new RestaurantService();
    favoriteService = new FavoriteService();
    detailPage = new DetailPage(restaurantService, favoriteService);

    dummyRestaurant = {
      id: '1',
      name: 'Restaurant A',
      city: 'Wakanda',
      rating: 5,
      description: '',
      address: '',
      smallPicture: '',
      mediumPicture: '',
      largePicture: '',
      menus: { foods: [], drinks: [] },
      categories: [],
      customerReviews: [],
    };
  });

  afterEach(() => {
    if (document.body.contains(detailPage)) {
      document.body.removeChild(detailPage);
    }
  });

  it('should render the untoggled button when a restaurant is not in the favorite list', async () => {
    spyOn(restaurantService, 'getRestaurant').withArgs('1').and.resolveTo(dummyRestaurant);
    spyOn(favoriteService, 'hasRestaurant').withArgs('1').and.resolveTo(false);

    detailPage.location = '/detail';
    detailPage.restaurantId = '1';

    document.body.appendChild(detailPage);
    await detailPage.firstUpdated();

    const likeButton = detailPage?.renderRoot.querySelector('mb-like-button');

    expect(restaurantService.getRestaurant).toHaveBeenCalledWith('1');
    expect(favoriteService.hasRestaurant).toHaveBeenCalledWith('1');
    expect(likeButton).toBeTruthy();
    expect(likeButton?.getAttribute('aria-label')).toEqual('Like this restaurant');
  });

  it('should render the toggled button when restaurant is in the favorite list', async () => {
    spyOn(favoriteService, 'getRestaurant').withArgs('1').and.resolveTo(dummyRestaurant);
    spyOn(favoriteService, 'hasRestaurant').withArgs('1').and.resolveTo(true);

    detailPage.location = '/favorite';
    detailPage.restaurantId = '1';

    document.body.appendChild(detailPage);
    await detailPage.firstUpdated();

    const likeButton = detailPage.renderRoot.querySelector('mb-like-button');

    expect(favoriteService.getRestaurant).toHaveBeenCalledWith('1');
    expect(favoriteService.hasRestaurant).toHaveBeenCalledWith('1');
    expect(likeButton).toBeTruthy();
    expect(likeButton?.getAttribute('aria-label')).toEqual('Dislike this restaurant');
  });

  it('should be able to add a restaurant to the favorite list', async () => {
    spyOn(restaurantService, 'getRestaurant').withArgs('1').and.resolveTo(dummyRestaurant);
    spyOn(favoriteService, 'putRestaurant').withArgs(dummyRestaurant);

    detailPage.location = '/detail';
    detailPage.restaurantId = '1';

    document.body.appendChild(detailPage);
    await detailPage.firstUpdated();

    expect(restaurantService.getRestaurant).toHaveBeenCalledWith('1');

    const likeButton = detailPage.renderRoot.querySelector('mb-like-button');
    expect(likeButton?.getAttribute('aria-label')).toEqual('Like this restaurant');

    likeButton?.dispatchEvent(new Event('click'));
    await likeButton?.updateComplete;

    expect(favoriteService.putRestaurant).toHaveBeenCalledWith(dummyRestaurant);
    expect(likeButton?.getAttribute('aria-label')).toEqual('Dislike this restaurant');
  });

  it('should fail to add a restaurant to the favorite list', async () => {
    spyOn(restaurantService, 'getRestaurant').withArgs('1').and.resolveTo(dummyRestaurant);
    spyOn(favoriteService, 'putRestaurant').withArgs(dummyRestaurant).and.rejectWith(new Error('failed to save an item'));

    detailPage.location = '/detail';
    detailPage.restaurantId = '1';

    document.body.appendChild(detailPage);
    await detailPage.firstUpdated();

    expect(restaurantService.getRestaurant).toHaveBeenCalledWith('1');

    const likeButton = detailPage.renderRoot.querySelector('mb-like-button');
    expect(likeButton?.getAttribute('aria-label')).toEqual('Like this restaurant');

    likeButton?.dispatchEvent(new Event('click'));
    await likeButton?.updateComplete;
    await likeButton?.updateComplete;

    expect(favoriteService.putRestaurant).toHaveBeenCalledWith(dummyRestaurant);
    expect(likeButton?.getAttribute('aria-label')).not.toEqual('Dislike this restaurant');
  });

  it('should be able to delete a restaurant in the favorite list', async () => {
    spyOn(favoriteService, 'getRestaurant').withArgs('1').and.resolveTo(dummyRestaurant);
    spyOn(favoriteService, 'deleteRestaurant').withArgs('1');

    detailPage.location = '/favorite';
    detailPage.restaurantId = '1';

    document.body.appendChild(detailPage);
    await detailPage.firstUpdated();

    expect(favoriteService.getRestaurant).toHaveBeenCalledWith('1');

    const likeButton = detailPage.renderRoot.querySelector('mb-like-button');
    expect(likeButton?.getAttribute('aria-label')).toEqual('Dislike this restaurant');

    likeButton?.dispatchEvent(new Event('click'));
    await likeButton?.updateComplete;

    expect(favoriteService.deleteRestaurant).toHaveBeenCalledWith('1');
    expect(likeButton?.getAttribute('aria-label')).toEqual('Like this restaurant');
  });

  it('should fail to delete a restaurant in the favorite list', async () => {
    spyOn(favoriteService, 'getRestaurant').withArgs('1').and.resolveTo(dummyRestaurant);
    spyOn(favoriteService, 'deleteRestaurant').withArgs('1').and.rejectWith(new Error('failed to delete an item'));

    detailPage.location = '/favorite';
    detailPage.restaurantId = '1';

    document.body.appendChild(detailPage);
    await detailPage.firstUpdated();

    expect(favoriteService.getRestaurant).toHaveBeenCalledWith('1');

    const likeButton = detailPage.renderRoot.querySelector('mb-like-button');
    expect(likeButton?.getAttribute('aria-label')).toEqual('Dislike this restaurant');

    likeButton?.dispatchEvent(new Event('click'));
    await likeButton?.updateComplete;
    await likeButton?.updateComplete;

    expect(favoriteService.deleteRestaurant).toHaveBeenCalledWith('1');
    expect(likeButton?.getAttribute('aria-label')).not.toEqual('Like this restaurant');
  });
});
