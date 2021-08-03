import 'reflect-metadata';

import HomePage from '../src/scripts/pages/homepage';


import { RestaurantService } from '../src/scripts/shared/restaurants-service';
import { Restaurant } from '../src/scripts/model/restaurant';
import { data } from './helpers/data';

describe('Home page', () => {
  let restaurantService: RestaurantService;
  let homePage: HomePage;
  let dummyRestaurants: Restaurant[];

  beforeEach(async () => {
    restaurantService = new RestaurantService();
    homePage = new HomePage(restaurantService);

    dummyRestaurants = data.dummyRestaurants;
  });

  afterEach(() => {
    if (document.body.contains(homePage)) {
      document.body.removeChild(homePage);
    }
  });

  it('should render all restaurants', async () => {
    spyOn(restaurantService, 'getRestaurants').and.resolveTo(dummyRestaurants);

    document.body.appendChild(homePage);
    await homePage.firstUpdated();

    expect(restaurantService.getRestaurants).toHaveBeenCalledWith();

    const articleListContent =
      homePage.renderRoot.querySelector<HTMLDivElement>('.article-list__content');

    expect(articleListContent?.children.length).toEqual(5);
  });

  it('should fail to render all restaurants', async () => {
    spyOn(restaurantService, 'getRestaurants').and.rejectWith(
      new Error('failed to fetch all items')
    );

    document.body.appendChild(homePage);
    await homePage.firstUpdated();

    await expectAsync(restaurantService.getRestaurants()).toBeRejectedWith(
      new Error('failed to fetch all items')
    );

    const articleListContent =
      homePage.renderRoot.querySelector<HTMLDivElement>('.article-list__content');

    expect(articleListContent?.childElementCount).toEqual(0);
  });

  describe('search restaurants', () => {
    it('should return all restaurants when the query is empty', async () => {
      spyOn(restaurantService, 'getRestaurants').and.resolveTo(dummyRestaurants);

      document.body.appendChild(homePage);
      await homePage.firstUpdated();

      const inputText = homePage.renderRoot.querySelector<HTMLInputElement>('input[name="q"]');
      if (inputText) {
        inputText.value = '';
        inputText.dispatchEvent(new Event('change'));
        await homePage.updateComplete;
        await homePage.updateComplete;

        const articleListContent =
          homePage.renderRoot.querySelector<HTMLDivElement>('.article-list__content');

        expect(articleListContent?.childElementCount).toEqual(5);

        inputText.value = ' ';
        inputText.dispatchEvent(new Event('change'));
        await homePage.updateComplete;
        await homePage.updateComplete;

        expect(articleListContent?.childElementCount).toEqual(5);

        inputText.value = '     ';
        inputText.dispatchEvent(new Event('change'));
        await homePage.updateComplete;
        await homePage.updateComplete;

        expect(articleListContent?.childElementCount).toEqual(5);

        inputText.value = '\n';
        inputText.dispatchEvent(new Event('change'));
        await homePage.updateComplete;
        await homePage.updateComplete;

        expect(articleListContent?.childElementCount).toEqual(5);

        inputText.value = '\t';
        inputText.dispatchEvent(new Event('change'));
        await homePage.updateComplete;
        await homePage.updateComplete;

        expect(articleListContent?.childElementCount).toEqual(5);
      } else {
        // Make this test fail
        expect(inputText).not.toBeFalsy();
      }
    });

    it('should return restaurants when query is not empty', async () => {
      const query = 'Warung';

      spyOn(restaurantService, 'getRestaurants').and.resolveTo(dummyRestaurants);
      spyOn(restaurantService, 'findRestaurants')
        .withArgs(query)
        .and.resolveTo(dummyRestaurants.filter((r) => r.name.includes(query)));

      document.body.appendChild(homePage);
      await homePage.firstUpdated();

      const inputText = homePage.renderRoot.querySelector<HTMLInputElement>('input[name="q"]');
      const searchForm = homePage.renderRoot.querySelector<HTMLFormElement>('form.search-form');
      if (inputText) {
        inputText.value = query;
        searchForm?.dispatchEvent(new Event('submit'));
        await homePage.updateComplete;
        await homePage.updateComplete;

        const articleListContent =
          homePage.renderRoot.querySelector<HTMLDivElement>('.article-list__content');

        expect(articleListContent?.childElementCount).toEqual(2);
      } else {
        // Make this text fail
        fail('input search is null');
      }
    });

    it('should fail to search for restaurants', async () => {
      const query = 'Warung';

      spyOn(restaurantService, 'getRestaurants').and.resolveTo(dummyRestaurants);
      spyOn(restaurantService, 'findRestaurants')
        .withArgs(query)
        .and.rejectWith(new Error('failed to search for restaurants'));

      document.body.appendChild(homePage);
      await homePage.firstUpdated();

      const inputText = homePage.renderRoot.querySelector<HTMLInputElement>('input[name="q"]');
      if (inputText) {
        inputText.value = query;
        inputText.dispatchEvent(new Event('change'));
        await homePage.updateComplete;
        await homePage.updateComplete;

        expect(restaurantService.getRestaurants).toHaveBeenCalledWith();
        await expectAsync(restaurantService.findRestaurants(query)).toBeRejectedWith(
          new Error('failed to search for restaurants')
        );
      } else {
        // Make this test fail
        fail('input search is null');
      }
    });
  });
});
