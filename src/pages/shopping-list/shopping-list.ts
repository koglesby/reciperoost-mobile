import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NgForm } from '@angular/forms/forms';

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  
  onAddItem(form: NgForm) {
    const value = form.value;
    console.log(value.itemName);
    console.log(value.amount);
  }

}
