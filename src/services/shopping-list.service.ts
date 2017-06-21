import { Ingredient } from '../models/ingredient.model';
export class ShoppingListService {
  private ingredients: Ingredient[] = [];

  addItem(name: string, amount: number) {
    this.ingredients.push(new Ingredient(name, amount));
    console.log(this.ingredients);
  }

  addItems(items: Ingredient[]) {
    this.ingredients.push(...items);
  }

  getItems() {
    return this.ingredients.slice();
  }

  getItem(index: number) {
    return this.ingredients[index];
  }

  removeItem(index: number) {
    this.ingredients.splice(index, 1);
  }
}