const express = require( 'express' );
const jsonfile = require( 'jsonfile' );
const file = 'pokedex.json';

// Init express app
const app = express();

app.use( express.json() );
app.use( express.urlencoded( {
    extended: true
} ) );

const methodOverride = require( 'method-override' )
app.use( methodOverride( '_method' ) );

/**
 * ===================================
 * Routes
 * ===================================
 */
app.post( '/pokemon', ( request, response ) => {
    let newPokemonObj = request.body;
    jsonfile.readFile( file, ( err, obj ) => {
        if ( err ) {
            console.log( `ERROR DETECTED WHILE READING: ${err}` );
        } else {
            obj[ "pokemon" ].push( newPokemonObj );
            jsonfile.writeFile( file, obj, ( err ) => {
                if ( err ) {
                    console.log( `ERROR DETECTED WHILE WRITING: ${err}` );
                } else {
                    response.send( "New pokemon added!  <a href='../pokemon'>back to Pokemon!</a>" );
                }
            } );
        }
    } );
} );

app.get( '/sortPokemon', ( request, response ) => {
    let data = "";
    let sortKey = Object.values( request.query )[ 0 ];
    let sortOrder = Object.values( request.query )[ 1 ];
    console.log( request.query );
    jsonfile.readFile( file, ( err, obj ) => {
        let pokemonArr;
        if ( sortOrder === "asc" ) {
            pokemonArr = obj[ "pokemon" ].sort( ( a, b ) => ( a[ sortKey ] > b[ sortKey ] ) ? 1 : -1 );
        } else {
            pokemonArr = obj[ "pokemon" ].sort( ( a, b ) => ( a[ sortKey ] < b[ sortKey ] ) ? 1 : -1 );
        }
        pokemonArr.forEach( ( pokemonObj, index ) => {
            data += `<img src=${pokemonObj.img}><p>${pokemonObj.id}: ${pokemonObj.name}</p>`;
        } );
        response.send( data );
    } );
} );

app.get( '/pokemon/new', ( request, response ) => {
    console.dir( "getting form" );
    let form = '<html>' +
        '<body>' +
        '<h1>Pokedex</h1>' +
        '<form method="POST" action="/pokemon">' +
        '<p>id</p><input name="id"/>' +
        '<p>num</p><input name="num"/>' +
        '<p>name</p><input name="name"/>' +
        '<p>img</p><input name="img"/>' +
        '<p>height</p><input name="height"/>' +
        '<p>weight</p><input name="weight"/>' +
        '<p><input type="submit"/></p>' +
        '</form>' +
        '</body>' +
        '</html>';
    response.send( form );
} );

app.put( "/putrequest/:id", ( request, response ) => {
    console.log( request.params.id );
    console.log( request.body );
    let paramsId = parseInt( request.params.id );
    let newPokemonObj = request.body;
    jsonfile.readFile( file, ( err, obj ) => {
        if ( err ) {
            console.log( `ERROR DETECTED WHILE READING: ${err}` );
        } else {
            let keyArr = Object.keys( request.body );
            keyArr.forEach( ( key, index ) => {
                console.log( "forEachLoop" );
                console.log( index );
                console.log( key );
                console.log( obj[ "pokemon" ][ paramsId ][ key ] );
                console.log( newPokemonObj[ key ] );

                obj[ "pokemon" ][ paramsId ][ key ] = newPokemonObj[ key ];
            } );
            jsonfile.writeFile( file, obj, ( err ) => {
                if ( err ) {
                    console.log( `ERROR DETECTED WHILE WRITING: ${err}` );
                } else {
                    response.send( "Information edited  <a href='../pokemon'>back to Pokemon!</a>" );
                }
            } );
        }
    } );
    //read the file in and write out to it

} );


app.delete( '/pokemon/:id', ( request, response ) => {
    let arrIndex = parseInt( request.params.id );
    console.log( "delete : ", arrIndex );
    jsonfile.readFile( file, ( err, obj ) => {
        obj[ "pokemon" ].splice( arrIndex, 1 );
        console.log( obj );
        jsonfile.writeFile( file, obj, ( err ) => {
            if ( err ) {
                console.log( `ERROR DETECTED WHILE WRITING: ${err}` );
            } else {
                response.send( "Information deleted <a href='../pokemon'>back to Pokemon!</a>" );
            }
        } );
    } );

} );

app.get( '/pokemon/:id/delete', ( request, response ) => {
    let paramsId = parseInt( request.params.id );
    let arrIndex = 0;
    console.log( "delete : ", request.params );
    jsonfile.readFile( file, ( err, obj ) => {
        let pokemonArr = obj[ "pokemon" ];
        for ( let i = 0; i < pokemonArr.length; i++ ) {
            if ( pokemonArr[ i ].id === paramsId ) {
                arrIndex = i;
                break;
            }
        }
        let pokemon = obj[ "pokemon" ][ arrIndex ];
        let html = '<form method="POST" action="/pokemon/' + arrIndex + '?_method=DELETE">' +
            '<input name="id" type="text" value="' + pokemon.id + '"/>' +
            '<input name="name" type="text" value="' + pokemon.name + '"/>' +
            '<input type="submit" value="delete this"/>' +
            '</form>';
        response.send( html );
    } );
} );


app.get( '/pokemon/:id/edit', ( request, response ) => {
    let paramsId = parseInt( request.params.id );
    let arrIndex = 0;
    console.log( "edit : ", request.params );
    jsonfile.readFile( file, ( err, obj ) => {
        let pokemonArr = obj[ "pokemon" ];
        for ( let i = 0; i < pokemonArr.length; i++ ) {
            if ( pokemonArr[ i ].id === paramsId ) {
                arrIndex = i;
                break;
            }
        }
        let pokemon = obj[ "pokemon" ][ arrIndex ];
        let html = '<form method="POST" action="/putrequest/' + arrIndex + '?_method=PUT">' +
            '<div class="pokemon-attribute">' +
            '<p>id:</p> <input name="id" type="text" value="' + pokemon.id + '"/>' +
            '<p>name:</p> <input name="name" type="text" value="' + pokemon.name + '"/>' +
            '<p>height:</p> <input name="height" type="text" value="' + pokemon.height + '"/>' +
            '<p>weight:</p> <input name="weight" type="text" value="' + pokemon.weight + '"/>' +
            '<p><input type="submit"/></p>'
        '</div>' +
        '</form>';
        response.send( html );
    } );
} );

// app.get( '/:id', ( request, response ) => {
//     jsonfile.readFile( file, ( err, obj ) => {
//         let inputId = parseInt( request.params.id );
//         let pokemon;
//         for ( let i = 0; i < obj.pokemon.length; i++ ) {
//             let currentPokemon = obj.pokemon[ i ];
//             if ( currentPokemon.id === inputId ) {
//                 pokemon = currentPokemon;
//             }
//         }
//         if ( pokemon === undefined ) {
//             response.status( 404 );
//             response.send( "not found" );
//         } else {
//             response.send( pokemon );
//         }
//     } );
// } );

app.get( '/pokemon', ( request, response ) => {
    let data = "";
    jsonfile.readFile( file, ( err, obj ) => {
        if ( err ) {
            console.log( `ERROR DETECTED WHILE READING: ${err}` );
        } else {
            obj[ "pokemon" ].forEach( ( pokemonObj, index ) => data += `<img src=${pokemonObj.img}><p>${pokemonObj.id}: ${pokemonObj.name}</p>` );
            let keysArr = Object.keys( obj[ "pokemon" ][ 0 ] );
            let optionData = "";
            keysArr.forEach( ( value, index ) => optionData += `<option value="${keysArr[index]}">${keysArr[index]}</option>` );

            let preData = '<form method="get" action="/sortPokemon">' +
                '<select name="keys">' +
                optionData +
                '</select>' +
                '<select name="order">' +
                '<option value="asc">Ascending</option>' +
                '<option value="dsc">Descending</option>' +
                '</select>' +
                '<input type="submit">' +
                '<h1>List of Pokemon!</h1>';
            response.send( preData + data );
        }
    } );
} );

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen( 3000, () => console.log( '~~~ Tuning in to the waves of port 3000 ~~~' ) );
