const app = require( "./controllers/burgers_controller.js" );

const db = require( "./models" );

const port = process.env.PORT || 3000;

db.sequelize.sync( { force: true } ).then(function() {
    app.listen( port, () => {
        console.log( "Listening on port " + port );
    });
});

