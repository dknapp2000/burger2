const express = require( "express" );
const orm = require( "../controllers/burger.js" );
const path = require( "path" );
const app = express();
const exphbs = require("express-handlebars");
const db = require( "../config/orm.js" );

const publicPath = path.join( __dirname, "public" );

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Allow static files the be sent.
app.use(express.static( publicPath ));

// The main url to display the page.
app.get( "/", function( req, res ) {
    db.selectAll()
    .then( function( burgers ) { 
        //console.log( burgers );
        res.render( "index", { "burgers": burgers } )
    }); 
});

// Eat a burger . . .
app.post( "/api/chomp/:id", function( req, res ) {
    // console.log( "Chomp: ", req.url );
    // console.log( req.params );
    db.updateOne( { "devoured": 1, "id": req.params.id } )
    .then( ( resp ) => {
        console.log( "Redirecting to /")
        res.redirect( "/" );
    })
});

// Add a new burger to the table
app.post( "/api/add/:name", function( req, res ) {
    console.log( req.params );
    db.insertOne( { "burger_name": req.params.name, "devoured": 0 })
    .then( (resp ) => {
        console.log( "redirecting to /" );
        res.redirect( "/" );
    })
})

module.exports = app;
