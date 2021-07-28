import 'reflect-metadata';

import '../src/scripts/pages/detailpage';

import DetailPage from '../src/scripts/pages/detailpage';

import { RestaurantService } from '../src/scripts/shared/restaurants-service';
import { FavoriteService } from '../src/scripts/shared/favorite-service';
import { CustomerReview, Restaurant } from '../src/scripts/model/restaurant';
import { data } from './helpers/data';

describe('Detail page', () => {
  let restaurantService: RestaurantService;
  let favoriteService: FavoriteService;
  let detailPage: DetailPage;
  let dummyRestaurant: Restaurant;
  let customerReviews: CustomerReview[];

  beforeEach(() => {
    restaurantService = new RestaurantService();
    favoriteService = new FavoriteService();
    detailPage = new DetailPage(restaurantService, favoriteService);

    customerReviews = data.customerReviews;

    dummyRestaurant = { ...data.dummyRestaurants[0], customerReviews: data.customerReviews };
  });

  afterEach(() => {
    if (document.body.contains(detailPage)) {
      document.body.removeChild(detailPage);
    }
  });

  it('should render detail page', async () => {
    spyOn(restaurantService, 'getRestaurant').withArgs('1').and.resolveTo(dummyRestaurant);

    detailPage.location = '/detail';
    detailPage.restaurantId = '1';

    document.body.appendChild(detailPage);
    await detailPage.firstUpdated();

    const restaurantName = detailPage.renderRoot.querySelector<HTMLHeadingElement>(
      '.restaurant__info h1.display-1'
    );
    const likeButton = detailPage.renderRoot.querySelector('mb-like-button');
    const flexibleRating = detailPage.renderRoot.querySelector('flexible-rating');

    expect(restaurantService.getRestaurant).toHaveBeenCalledWith('1');
    expect(restaurantName).toBeTruthy();
    expect(restaurantName?.textContent?.trim()).toEqual(dummyRestaurant.name);
    expect(likeButton).toBeTruthy();
    expect(likeButton?.getAttribute('aria-label')).toEqual('Like this restaurant');
    expect(flexibleRating).toBeTruthy();
    expect(flexibleRating?.value).toEqual(dummyRestaurant.rating);
  });

  it('should fail rendering page', async () => {
    spyOn(restaurantService, 'getRestaurant')
      .withArgs('1')
      .and.rejectWith(new Error('failed to get a restaurant'));

    detailPage.location = '/detail';
    detailPage.restaurantId = '1';

    document.body.appendChild(detailPage);
    await detailPage.firstUpdated();

    await expectAsync(restaurantService.getRestaurant('1')).toBeRejectedWith(
      new Error('failed to get a restaurant')
    );
  });

  describe('liking a restaurant', () => {
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
      spyOn(favoriteService, 'putRestaurant')
        .withArgs(dummyRestaurant)
        .and.rejectWith(new Error('failed to save an item'));

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
      spyOn(favoriteService, 'deleteRestaurant')
        .withArgs('1')
        .and.rejectWith(new Error('failed to delete an item'));

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

  describe('customer review', () => {
    it('should load customer reviews from the server', async () => {
      spyOn(restaurantService, 'getRestaurant').withArgs('1').and.resolveTo(dummyRestaurant);

      detailPage.location = '/detail';
      detailPage.restaurantId = '1';

      document.body.appendChild(detailPage);
      await detailPage.firstUpdated();

      expect(restaurantService.getRestaurant).toHaveBeenCalledWith('1');
      expect(detailPage.customerReviews).toBe(dummyRestaurant.customerReviews);

      const customerReviewList =
        detailPage.renderRoot.querySelector<HTMLUListElement>('.customer-reviews__list');
      expect(customerReviewList?.childNodes.length).not.toEqual(0);
    });

    it('should send customer review to the server', async () => {
      const myReview: CustomerReview = {
        id: '1',
        name: 'Deddy',
        review: 'Test 4',
      };

      spyOn(restaurantService, 'postReview')
        .withArgs(myReview)
        .and.resolveTo([...customerReviews, { ...myReview, date: '4 October 1995' }]);

      detailPage.location = '/detail';
      detailPage.restaurantId = '1';

      document.body.appendChild(detailPage);
      await detailPage.updateComplete;

      const nameText = detailPage.reviewForm?.querySelector<HTMLInputElement>('input[name="name"]');
      const reviewText =
        detailPage.reviewForm?.querySelector<HTMLTextAreaElement>('textarea[name="review"]');

      if (nameText && reviewText) {
        nameText.value = myReview.name;
        reviewText.value = myReview.review;

        detailPage.reviewForm?.dispatchEvent(new Event('submit'));
        await detailPage.updateComplete;
        await detailPage.updateComplete;

        expect(restaurantService.postReview).toHaveBeenCalledWith(myReview);

        const customerReviewList =
          detailPage.renderRoot.querySelector<HTMLUListElement>('.customer-reviews__list');
        expect(customerReviewList?.childElementCount).toEqual(4);
      }
    });

    it('should fail sending customer review to the server', async () => {
      const myReview: CustomerReview = {
        id: '1',
        name: 'Deddy',
        review: 'Test 4',
      };

      spyOn(restaurantService, 'postReview')
        .withArgs(myReview)
        .and.rejectWith(new Error('failed to send a review'));

      detailPage.location = '/detail';
      detailPage.restaurantId = '1';

      document.body.appendChild(detailPage);
      await detailPage.updateComplete;

      const nameText = detailPage.reviewForm?.querySelector<HTMLInputElement>('input[name="name"]');
      const reviewText =
        detailPage.reviewForm?.querySelector<HTMLTextAreaElement>('textarea[name="review"]');

      if (nameText && reviewText) {
        nameText.value = myReview.name;
        reviewText.value = myReview.review;

        detailPage.reviewForm?.dispatchEvent(new Event('submit'));
        await detailPage.updateComplete;
        await detailPage.updateComplete;

        expect(restaurantService.postReview).toHaveBeenCalledWith(myReview);
        await expectAsync(restaurantService.postReview(myReview)).toBeRejectedWith(
          new Error('failed to send a review')
        );
      }
    });
  });
});
