import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Recipe } from '../../models/recipe.model';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { ShoppingListService } from '../../services/shopping-list.service';
import { RecipesService } from '../../services/recipes.service';

@IonicPage()
@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage implements OnInit {
  
  recipe: Recipe;
  index: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private slService: ShoppingListService,
              private recipesService: RecipesService,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.recipe = this.navParams.get('recipe');
    this.index = this.navParams.get('index');
  }
  
  onEditRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'Edit', recipe: this.recipe, index: this.index});
  }

  onAddIngredients() {
    this.slService.addItems(this.recipe.ingredients);
    const toast = this.toastCtrl.create({
      message: 'Added ingredients to Shopping List',
      duration: 1700,
      position: 'bottom'
    });
    toast.present();
  }

  onDeleteRecipe() {
    const alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to remove this recipe?',
      buttons: [{
        text: 'Yeah',
        handler: () => {
          this.recipesService.removeRecipe(this.index);
          this.navCtrl.popToRoot();
          const toast = this.toastCtrl.create({
            message: 'Deleted Recipe',
            duration: 1700,
            position: 'bottom'
          });
          toast.present();
        }
      },
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('cancelled');
        }
      }]
    });
    alert.present();
  }
}
