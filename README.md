# Doga.js
HTML5 Video, cue point event helper

## Usage

    var chapters = [ 28.5, 70, 76, 85, 95, 106, 114, 125, 141.5, 152 ];
    var Doga = window.Doga;
    var cue = new Doga.Cue();
    var i, limit;
    
    for ( i = 0, limit = chapters.length; i < limit; i = (i + 1)|0 ) {
        cue.add( chapters[ i ] );
    }
    
    function load ( event ) {
        console.log( 'load ', event );
    }
    
    function cuePoint ( event ) {
        console.log( event.time );
    }
    
    function update ( event ) {
        console.log( event.currentTime );
    }
    
    function end ( event ) {
        console.log( 'end ', event );
    }
    
    var player = new Doga.Player( 'video', cue );
    
    player.on( Doga.Player.LOADED, load );
    player.on( Doga.Player.CUE_POINT, cuePoint );
    player.on( Doga.Player.UPDATE, update );
    player.on( Doga.Player.END, end );
    
    player.init();
