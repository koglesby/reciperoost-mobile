import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { RecipesService } from '../../services/recipes.service';
import { Recipe } from '../../models/recipe.model';


@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {

  constructor(private navCtrl: NavController, private recipesService: RecipesService) {
  }

  recipes: Recipe[];

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecipesPage');
  }
  
  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  ionViewWillEnter() {
    this.recipes = this.recipesService.getRecipes();
  }

  onLoadRecipe() {
    
  }

}
