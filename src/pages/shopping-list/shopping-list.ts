import { Component } from '@angular/core';
import { IonicPage, PopoverController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping-list.service';
import { Ingredient } from '../../models/ingredient.model'
import { SLOptionsPage } from './sl-options/sl-options';

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
    
  constructor(private slService: ShoppingListService,
              private popoverCtrl: PopoverController  ) {}

  someName: string;
  someAmount: number;

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
  
  onEditItem(index){
    this.someName = this.slService.getItem(index).name;
    this.someAmount = this.slService.getItem(index).amount;
    this.slService.removeItem(index);
    this.loadItems();
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(SLOptionsPage);
    popover.present({ev: event});
  }
  
  private loadItems() {
    this.listItems = this.slService.getItems();
  }

}
