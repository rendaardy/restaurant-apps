import { config } from '../shared/config';

interface Category {
  name: string;
}

interface Food {
  name: string;
}

interface Drink {
  name: string;
}

interface Menus {
  foods: Food[];
  drinks: Drink[];
}

export interface CustomerReview {
  id?: string;
  name: string;
  review: string;
  date?: string;
}

export class Restaurant {
  id: string = '';

  name: string = '';

  description: string = '';

  smallPicture: string = '';

  mediumPicture: string = '';

  largePicture: string = '';

  city: string = '';

  rating: number = 0;

  address: string = '';

  categories: Category[] = [];

  menus: Menus = { foods: [], drinks: [] };

  customerReviews: CustomerReview[] = [];

  static fromJSON(json: any): Restaurant {
    const restaurant = new Restaurant();
    restaurant.id = json.id;
    restaurant.name = json.name;
    restaurant.description = json.description;
    restaurant.smallPicture = `${config.baseImgUrl}/small/${json.pictureId}`;
    restaurant.mediumPicture = `${config.baseImgUrl}/medium/${json.pictureId}`;
    restaurant.largePicture = `${config.baseImgUrl}/large/${json.pictureId}`;
    restaurant.city = json.city;
    restaurant.rating = json.rating;
    restaurant.address = json.address;
    restaurant.categories = json.categories;
    restaurant.menus = json.menus;
    restaurant.customerReviews = json.customerReviews;
    return restaurant;
  }
}
