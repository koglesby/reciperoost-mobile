import { Component } from '@angular/core';
import { IonicPage, PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping-list.service';
import { Ingredient } from '../../models/ingredient.model'
import { AuthService } from '../../services/auth.service';
import { DatabaseOptionsPage } from '../database-options/database-options';

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
    
  constructor(private slService: ShoppingListService,
              private popoverCtrl: PopoverController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private authService: AuthService) {}

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
    const loading =  this.loadingCtrl.create({
      content: 'Loading  :)'
    });
    const saving =  this.loadingCtrl.create({
      content: 'Saving  :)'
    });
    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event});
    popover.onDidDismiss(
      data => {
        if (!data) {
          return;
        }
        if (data.action == 'load') {
          loading.present();
          this.authService.getActiveUser().getToken()
            .then(
              (token: string) => {
                this.slService.fetchList(token)
                  .subscribe(
                    (list: Ingredient[]) => {
                      loading.dismiss();
                      if (list) {
                        this.listItems = list;
                      } else {
                        this.listItems = [];
                      }
                    },
                    error => {
                      loading.dismiss();
                      this.handleError(error.json().error);
                    }
                  )
              }
            );
        } else if (data.action == 'store') {
          saving.present();
          this.authService.getActiveUser().getToken()
            .then(
              (token: string) => {
                this.slService.storeList(token)
                  .subscribe(
                    () => saving.dismiss(),
                    error => {
                      saving.dismiss();
                      this.handleError(error.json().error);
                    }
                  )
              }
            );
        }
      }
    )
  }
  
  private loadItems() {
    this.listItems = this.slService.getItems();
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'Error',
      message: errorMessage,
      buttons: ['OK']
    });
    alert.present();
  }

}
