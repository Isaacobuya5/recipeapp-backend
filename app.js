const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');
const bodyParser = require('body-parser');

const app = express();


//connecting to mongoose database
mongoose.connect('mongodb+srv://isaac:YZv5xlNvqwuJMa2Z@cluster0-zob1a.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => {
        console.log('Succesfuly connected to mongodb atlas')
    }).catch((error) => {
        console.log('Unable to connect succesfully to mongodb atlas');
        console.error(error);
    })


    //this allows requests from all origins to access your API
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    });
    app.use(bodyParser.json());

//implement routes
//returns all recipes in the database
app.get('/api/recipes', (req,res,) => {
    Recipe.find().then((recipes) => {
        res.status(200).json(recipes);
    }).catch((error) => {
        res.status(400).json({
            error: error
        });
    });
});

//return recipe with given id
app.get('/api/recipes/:id', (req,res,next) => {
    Recipe.findOne({ _id: req.params.id}).then((recipe) => {
        res.status(200).json(recipe);
    }).catch((error) => {
        res.status(404).json(400);
    });
});

//add a new recipe to the database
app.post('/api/recipes', (req, res, next) => {
    console.log(req.body);
    const recipe = new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        time: req.body.time,
        difficulty: req.body.difficulty
    });
    //saving to database - returns a new promise
    recipe.save().then(() => {
        res.status(201).json({
          message: 'Post saved succesfully'
        });
    }).catch((error) => {
      res.status(400).json({
        error: error
      });
      console.log(error);
    });

});

//modifies the recipe with the provided id
app.put('/api/recipes/:id', (req,res) => {
    const recipe = new Recipe({
        _id: req.params.id,
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        time: req.body.time,
        difficulty: req.body.difficulty
    });
    Recipe.updateOne({
        _id: req.params.id
    }, recipe).then(() => {
        res.status(201).json({
            message: "Recipe updated succesfully."
        });
    }).catch((error) => {
        res.status(400).json({
            error: error
        });
    });
});

//deletes the recipes with the provided id
app.delete('/api/recipes/:id', (req,res,next) => {
    Recipe.deleteOne({_id: req.params.id, next}).then(
        () => {
            res.status(200).json({
                message: "Deleted recipe succesful"
            });
        }
    ).catch((error) => {
        res.status(400).json({
            error: error
        })
    });
});












module.exports = app;