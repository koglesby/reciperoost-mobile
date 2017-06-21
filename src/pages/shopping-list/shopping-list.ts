import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping-list.service';
import { Ingredient } from '../../models/ingredient.model'

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {



  constructor(private slService: ShoppingListService) {}

  listItems: Ingredient[];

  ionViewWillEnter() {
    this.loadItems();
  }

  onAddItem(form: NgForm) {
    this.slService.addItem(form.value.itemName, form.value.amount);
    form.reset();
    this.loadItems();
  }
  
  onRemoveItem(index: number) {
    this.slService.removeItem(index);
    this.loadItems();
  }
  
  private loadItems() {
    this.listItems = this.slService.getItems();
  }

}
