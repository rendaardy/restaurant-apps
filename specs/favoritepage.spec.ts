import 'reflect-metadata';

import '../src/scripts/pages/favoritepage';

import FavoritePage from '../src/scripts/pages/favoritepage';
import { FavoriteService } from '../src/scripts/shared/favorite-service';
import { Restaurant } from '../src/scripts/model/restaurant';
import { data } from './helpers/data';

describe('Favorite page', () => {
  let favoriteService: FavoriteService;
  let favoritePage: FavoritePage;
  let dummyRestaurants: Restaurant[];

  beforeEach(() => {
    favoriteService = new FavoriteService();
    favoritePage = new FavoritePage(favoriteService);

    dummyRestaurants = data.dummyRestaurants;
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

    await expectAsync(favoriteService.getRestaurants()).toBeRejectedWith(
      new Error('failed to get all items')
    );
  });
});
