import { Container } from 'inversify';
import { IRestaurantService, IFavoriteService, TYPES } from './restaurant-interface';
import { RestaurantService } from './restaurants-service';
import { FavoriteService } from './favorite-service';

export const container = new Container();
container.bind<IRestaurantService>(TYPES.RESTAURANT_SERVICE).to(RestaurantService);
container.bind<IFavoriteService>(TYPES.FAVORITE_SERVICE).to(FavoriteService);
