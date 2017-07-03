import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams, PopoverController, LoadingController,
  AlertController
} from 'ionic-angular';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { RecipesService } from '../../services/recipes.service';
import { Recipe } from '../../models/recipe.model';
import { RecipePage } from '../recipe/recipe';
import { DatabaseOptionsPage } from '../database-options/database-options';
import { AuthService } from '../../services/auth.service';


@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {

  constructor(private navCtrl: NavController,
              private recipesService: RecipesService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private authService: AuthService,
              private popoverCtrl: PopoverController) {
  }

  recipes: Recipe[];
  
  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  ionViewWillEnter() {
    this.recipes = this.recipesService.getRecipes();
    
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
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
                this.recipesService.fetchList(token)
                  .subscribe(
                    (list: Recipe[]) => {
                      loading.dismiss();
                      if (list) {
                        this.recipes = list;
                      } else {
                        this.recipes = [];
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
                this.recipesService.storeList(token)
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

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'Error',
      message: errorMessage,
      buttons: ['OK']
    });
    alert.present();
  }

}
