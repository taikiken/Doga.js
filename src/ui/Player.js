///**
// * license inazumatv.com
// * author (at)taikiken / http://inazumatv.com
// * date 15/09/18 - 19:39
// *
// * Copyright (c) 2011-2015 inazumatv.com, inc.
// *
// * Distributed under the terms of the MIT license.
// * http://www.opensource.org/licenses/mit-license.html
// *
// * This notice shall be included in all copies or substantial portions of the Software.
// *
// */
/**
 * 参考 OSMF.MediaPlayer
 * 
 * http://help.adobe.com/ja_JP/FlashPlatform/reference/actionscript/3/org/osmf/media/MediaPlayer.htm
 *
 * HTML Audio and Video DOM Reference
 *
 * http://www.w3schools.com/tags/ref_av_dom.asp
 *
 * @type {Player}
 */
( function ( window ) {

  'use strict';

  var
    document = window.document,
    Doga = window.Doga;

  Doga.Player = ( function () {

    var
      EventDispatcher = Doga.EventDispatcher;

    /**
     * @class Player
     * @uses EventDispatcher
     * @param {String} id video tag id, #無し
     * @param {Cue} [cue] Cue instance
     * @constructor
     */
    function Player ( id, cue ) {

      /**
       * video tag element
       * @property video
       * @type {Element}
       */
      this.video = document.getElementById( id );
      /**
       * @property playing
       * @type {boolean}
       */
      this.playing = false;
      /**
       * @property loaded
       * @type {boolean}
       */
      this.loaded = false;
      /**
       * @property currentTime
       * @type {number}
       */
      this.currentTime = 0;
      /**
       * @property duration
       * @type {number}
       */
      this.duration = 0;
      /**
       * @property boundUpdate
       * @type {function(this:Player)}
       */
      this.boundUpdate = this.update.bind( this );
      /**
       * @property cue
       * @type {undefined|null|Cue}
       */
      this.cue = cue;
      /**
       * @property boundLoad
       * @type {function(this:Player)}
       */
      this.boundLoad = this.onLoad.bind( this );
      /**
       * @property boundEnded
       * @type {function(this:Player)|*}
       */
      this.boundEnded = this.onEnded.bind( this );

    }

    /**
     * @event LOADED
     * @static
     * @type {string}
     */
    Player.LOADED = 'playerLoaded';
    /**
     * @event UPDATE
     * @static
     * @type {string}
     */
    Player.UPDATE = 'playerUpdate';
    /**
     * @event PLAY
     * @static
     * @type {string}
     */
    Player.PLAY = 'playerPlayer';
    /**
     * @event STOP
     * @static
     * @type {string}
     */
    Player.STOP = 'playerStop';
    /**
     * @event END
     * @static
     * @type {string}
     */
    Player.END = 'playerEnd';
    /**
     * @event CUE_POINT
     * @static
     * @type {string}
     */
    Player.CUE_POINT = 'playerCuePoint';

    var p = Player.prototype;
    p.constructor = Player;

    // mixin
    EventDispatcher.initialize( p );
    /**
     * 初期処理, Cue.init を実行し cue point data を準備します
     *
     * Player instance 作成後必ず実行してください
     *
     * @method init
     */
    p.init = function () {

      var
        cue = this.cue,
        video = this.video;

      if ( !!cue ) {

        cue.init();

      }

      if ( !!video ) {

        video.addEventListener( 'loadeddata', this.boundLoad, false );

      }

    };

    /**
     * video.onloadeddata event handler
     *
     * @method onLoad
     * @param {Event} event video.loadeddata
     */
    p.onLoad = function ( event ) {

      var
        video = this.video;

      video.removeEventListener( 'loadeddata', this.boundLoad );
      this.duration = video.duration;
      this.loaded = true;

      this.dispatchEvent( { type: Player.LOADED, event: event } );

    };
    /**
     * video.onended event handler
     *
     * @method onEnded
     */
    p.onEnded = function () {

      this.dispatchEvent( { type: Player.END, event: event } );

    };

    /**
     * @method update
     * @param {Event} event
     */
    p.update = function ( event ) {

      var
        currentTime = this.video.currentTime,
        cue = this.cue,
        cueTime,
        cuePoint;

      this.currentTime = currentTime;
      this.dispatchEvent( { type: Player.UPDATE, currentTime: currentTime, event: event } );

      if ( !!cue ) {

        // not null
        cuePoint = cue.insect( currentTime );

        if ( !!cuePoint && !cuePoint.fire ) {

          cueTime = cuePoint.start;
          cue.fired( cueTime );
          this.dispatchEvent( { type: Player.CUE_POINT, time: cueTime, currentTime: currentTime, event: event } );

        }

      }

    };

    /**
     * @method watch
     * @return {Player}
     */
    p.watch = function () {

      this.video.addEventListener( 'timeupdate', this.boundUpdate, false );
      this.video.addEventListener( 'ended', this.boundEnded, false );
      return this;

    };

    /**
     * @method unwatch
     * @return {Player}
     */
    p.unwatch = function () {

      this.video.removeEventListener( 'timeupdate', this.boundUpdate );
      this.video.removeEventListener( 'ended', this.boundEnded );
      return this;

    };

    /**
     * @method element
     * @return {Element|*}
     */
    p.element = function () {

      return this.video;

    };

    /**
     * @method canSeekTo
     * @param {Number} time
     * @return {boolean}
     */
    p.canSeekTo = function ( time ) {

      var
        result = false;

      if ( this.loaded ) {

        result = this.duration > time;

      }

      return result;

    };

    /**
     * @method stop
     * @return {Player}
     */
    p.stop = function () {

      if ( !this.playing ) {

        return this;

      }

      this.pause();
      this.video.currentTime = 0;
      this.cue.resetAll();

      return this;

    };

    /**
     * @method pause
     * @return {Player}
     */
    p.pause = function () {

      if ( !this.playing ) {

        return this;

      }

      this.unwatch();
      this.video.pause();
      this.playing = false;

      return this;

    };

    /**
     * @method play
     * @return {Player}
     */
    p.play = function () {

      if ( this.playing ) {

        return this;

      }

      this.watch();
      this.video.play();
      this.playing = true;

      return this;

    };

    /**
     * @method seek
     * @param {Number} time
     * @return {Player}
     */
    p.seek = function ( time ) {

      if ( !this.canSeekTo( time ) ) {

        return this;

      }

      var
        cue = this.cue,
        index;

      if ( !!cue ) {

        if ( time === 0 ) {

          cue.resetAll();

        } else {

          index = cue.index( time );
          if ( index >= 0 ) {

            cue.reset( index );

          }

        }

      }// cue

      this.video.currentTime = time;
      this.play();

      return this;

    };

    return Player;

  }() );

}( window ) );