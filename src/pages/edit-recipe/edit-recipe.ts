import { Component, OnInit } from '@angular/core';
import {
  IonicPage, NavController, NavParams, ActionSheetController, AlertController,
  ToastController
} from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { RecipesService } from '../../services/recipes.service';
import { Recipe } from '../../models/recipe.model';

@IonicPage()
@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {
  mode = 'New';
  selectOptions = ['Easy', 'Medium', 'Hard'];
  recipeForm: FormGroup;
  recipe: Recipe;
  index: number;

  constructor(private actionSheetCtrl: ActionSheetController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private recipesService: RecipesService,
              private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if (this.mode == 'Edit') {
      this.recipe = this.navParams.get('recipe');
      this.index = this.navParams.get('index');
    }
    this.initializeForm();
  }

  private initializeForm() {
    let title = null;
    let description = null;
    let difficulty = 'Medium';
    let ingredients = [];

    if (this.mode == 'Edit') {
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      console.log(this.recipe.ingredients);
      for (let ingredient of this.recipe.ingredients) {
        ingredients.push(new FormGroup({
          'name': new FormControl(ingredient.name, Validators.required),
          'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/[1-9]+[0-9]*$/)])
        }))
      }
    }

    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      'difficulty': new FormControl(difficulty, Validators.required),
      'ingredients': new FormArray(ingredients)
    });

  }

  onSubmit() {
    const value = this.recipeForm.value;
    let ingredients = [];

    if (value.ingredients.length > 0) {
      ingredients = value.ingredients.map((name, amount) => {
        return {name: name, amount: amount};
      });

    }
    if (this.mode == 'Edit') {
      this.recipesService.updateRecipe(this.index,value.title, value.description, value.difficulty, value.ingredients)
    } else {
      this.recipesService.addRecipe(value.title, value.description, value.difficulty, value.ingredients);
    }
    this.recipeForm.reset();
    this.navCtrl.popToRoot();
  }

  onManageIngredients() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Add Ingredient',
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: 'Remove all Ingredients',
          role: 'destructive',
          handler: () => {
            const fArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
            const leng = fArray.length;
            if (leng > 0) {
              for (let i = leng - 1; i >= 0; i--) {
                fArray.removeAt(i);
              }
              const toast = this.toastCtrl.create({
                message: 'Deleted all ingredients',
                duration: 1700,
                position: 'bottom'
              });
              toast.present()
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private createNewIngredientAlert() {
    return this.alertCtrl.create({
      title: 'Add Ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
        {
          name: 'amount',
          placeholder: 'Amount'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if (data.name.trim() == '' || data.name == null) {
              const toast = this.toastCtrl.create({
                message: 'Please enter a valid value',
                duration: 1700,
                position: 'bottom'
              });
              toast.present()
              return;
            }
            console.log(this.recipeForm.get('ingredients'));
            (<FormArray>this.recipeForm.get('ingredients')).push (
              new FormGroup({
                'name': new FormControl(data.name, Validators.required),
                'amount': new FormControl(data.amount, [Validators.required, Validators.pattern(/[1-9]+[0-9]*$/)])
              })
            );
            console.log(data.amount);
            const toast = this.toastCtrl.create({
              message: 'Item Added',
              duration: 1700,
              position: 'bottom'
            });
            toast.present()
          }
        },

      ]
    });
  }

}
