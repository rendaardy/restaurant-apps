import 'reflect-metadata';

import '../src/scripts/pages/favoritepage';

import FavoritePage from '../src/scripts/pages/favoritepage';
import { FavoriteService } from '../src/scripts/shared/favorite-service';
import { Restaurant } from '../src/scripts/model/restaurant';

describe('Favorite page', () => {
  let favoriteService: FavoriteService;
  let favoritePage: FavoritePage;
  let dummyRestaurants: Restaurant[];

  beforeEach(() => {
    favoriteService = new FavoriteService();
    favoritePage = new FavoritePage(favoriteService);

    dummyRestaurants = [
      {
        id: '1',
        name: 'Warung Seblak',
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
      },
      {
        id: '2',
        name: 'Warung Kopi',
        city: 'Bali',
        rating: 4,
        description: '',
        address: '',
        smallPicture: '',
        mediumPicture: '',
        largePicture: '',
        menus: { foods: [], drinks: [] },
        categories: [],
        customerReviews: [],
      },
      {
        id: '3',
        name: 'Corner Caffe',
        city: 'Megalodon',
        rating: 3,
        description: '',
        address: '',
        smallPicture: '',
        mediumPicture: '',
        largePicture: '',
        menus: { foods: [], drinks: [] },
        categories: [],
        customerReviews: [],
      },
      {
        id: '4',
        name: 'Restoran Padang',
        city: 'Sunda Empire',
        rating: 4.5,
        description: '',
        address: '',
        smallPicture: '',
        mediumPicture: '',
        largePicture: '',
        menus: { foods: [], drinks: [] },
        categories: [],
        customerReviews: [],
      },
      {
        id: '5',
        name: 'Kafe Kita',
        city: 'Korea Utara',
        rating: 5,
        description: '',
        address: '',
        smallPicture: '',
        mediumPicture: '',
        largePicture: '',
        menus: { foods: [], drinks: [] },
        categories: [],
        customerReviews: [],
      },
    ];
  });

  afterEach(() => {
    if (document.body.contains(favoritePage)) {
      document.body.removeChild(favoritePage);
    }
  });

  it('should render all restaurants from favorite list', async () => {
    spyOn(favoriteService, 'getRestaurants').and.resolveTo(dummyRestaurants);

    document.body.appendChild(favoritePage);
    await favoritePage.firstUpdated();

    expect(favoriteService.getRestaurants).toHaveBeenCalled();

    const articleListContent = favoritePage.renderRoot.querySelector('.article-list__content');
    expect(articleListContent?.childElementCount).toEqual(5);
  });

  it('should fail to render all restaurants from favorite list', async () => {
    spyOn(favoriteService, 'getRestaurants').and.rejectWith(new Error('failed to get all items'));

    document.body.appendChild(favoritePage);
    await favoritePage.firstUpdated();

    await expectAsync(favoriteService.getRestaurants()).toBeRejectedWith(new Error('failed to get all items'));
  });
});
