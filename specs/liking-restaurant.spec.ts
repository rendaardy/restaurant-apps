import 'reflect-metadata';

import '../src/scripts/pages/detailpage';

import { Router } from '@vaadin/router';

import DetailPage from '../src/scripts/pages/detailpage';
import { RestaurantService } from '../src/scripts/shared/restaurants-service';
import { FavoriteService } from '../src/scripts/shared/favorite-service';

describe('Liking a restaurant', () => {
  let restaurantService: RestaurantService;
  let favoriteService: FavoriteService;
  let detailPage: DetailPage;
  let router: Router;

  beforeEach(() => {
    document.body.innerHTML = '<div id="router-outlet"></div>';
    router = new Router(document.querySelector('#router-outlet'));

    restaurantService = new RestaurantService();
    favoriteService = new FavoriteService();

    restaurantService = spyOnAllFunctions<RestaurantService>(restaurantService);
    favoriteService = spyOnAllFunctions<FavoriteService>(favoriteService);
    detailPage = new DetailPage(restaurantService, favoriteService);
  });

  afterEach(() => {
    document.body.removeChild(detailPage);
  });

  fit('should render the untoggled button when a restaurant is not in the favorite list', () => {
    detailPage.restaurantId = '1';
    if (detailPage.restaurant) detailPage.restaurant.name = 'Test';
    document.body.appendChild(detailPage);

    expect(document.querySelector('#router-outlet')).toBeTruthy();

    // expect(detailPage.hasChildNodes()).toBeFalse();

    // const likeButton = document.querySelector('mb-like-button[aria-label="Like this movie"]');
    // expect(likeButton).toBeTruthy();
  });

  it('should render the toggled button when restaurant is in the favorite list', () => {});

  it('should be able to add a restaurant to the favorite list', () => {});

  it('should be able to delete a restaurant in the favorite list', () => {});

  it("should not add a restaurant when it's already in the favorite list", () => {});
});
