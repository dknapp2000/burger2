
const db = require( "./models" );

const app = require( "./controllers/burgers_controller.js" )(db);

const port = process.env.PORT || 3000;

db.sequelize.sync( { } ).then(function() {
    app.listen( port, () => {
        console.log( "Listening on port " + port );
    });
});

