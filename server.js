const app = require( "./controllers/burgers_controller.js" );

const port = process.env.PORT || 3000;

app.listen( port, () => {
    console.log( "Listening on port " + port );
});

