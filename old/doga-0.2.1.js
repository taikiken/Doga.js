/**
 * @license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 15/09/18 - 19:37
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 * build: 2015-10-08 17:43:32
 * version: 0.2.1
 * url https://github.com/taikiken/doga.js
 */
/**
 *
 * ## 動画(HTML 5 Video)コントロール
 *
 * 依存ファイルはありません。
 *
 * ### Support
 *
 * IE 9, IE 10, IE 11, Edge latest, Chrome latest, Safari latest, Firefox latest
 *
 * @module Doga
 * @type {Doga}
 */
var Doga = window.Doga || {};
/*jslint -W016*/
/**
 * @type {EventDispatcher}
 *
 * ## カスタム Event を管理します
 *
 * 1. 必要なClassでmixinします
 * 2. mixin 後下記の6関数が使用できるようになります
 *
 *
 *      addEventListener
 *      hasEventListener
 *      removeEventListener
 *      dispatchEvent
 *      on
 *      off
 *
 *      function SomeClass () {}
 *      // mixin
 *      Gasane.EventDispatcher.initialize( SomeClass.prototype );
 *
 *
 * Gasane.EventDispatcher からコピー
 *
 */
( function ( window ){

  'use strict';

  window.Doga.EventDispatcher = ( function (){
    /**
     * ### カスタム Event を管理します
     * - 必要なClassでmixinします
     * - mixin 後下記の6関数が使用できるようになります
     *
     *
     *      addEventListener
     *      hasEventListener
     *      removeEventListener
     *      dispatchEvent
     *      on
     *      off
     *
     * ### mixin
     *
     *      function SomeClass () {}
     *      // mixin
     *      Gasane.EventDispatcher.initialize( SomeClass.prototype );
     *
     * @class EventDispatcher
     * @constructor
     */
    function EventDispatcher () {}

    var p = EventDispatcher.prototype;
    p.constructor = EventDispatcher;

    /**
     * イベントにハンドラを登録します
     *
     * ハンドラ内のthisはイベント発生元になるので注意が必要です
     *
     * this参照を変えないために bind を使用する方法があります
     *
     *      function EventReceive () {
     *          var example = new ExampleClass();
     *
     *          example.addEventListener( "other", onOtherHandler );
     *          example.addEventListener( "example", this.onBoundHandler.bind( this ) );
     *      }
     *
     *      EventReceive.prototype.onOtherHandler ( event ) {
     *          console.log( this );// ExampleClass
     *      }
     *
     *      EventReceive.prototype.onBoundHandler ( event ) {
     *          console.log( this );// EventReceive
     *      }
     *
     * @method addEventListener
     * @param {string} type event type
     * @param {function} listener event handler
     */
    p.addEventListener = function ( type, listener ) {

      this.on( type, listener );

    };
    /**
     * addEventListener alias
     * @method on
     * @param {string} type event type
     * @param {function} listener event handler
     */
    p.on = function ( type, listener ) {

      if ( typeof listener === 'undefined' ) {
        // listener undefined
        return;

      }

      if ( typeof this._listeners === 'undefined') {

        this._listeners = {};

      }

      var listeners = this._listeners;

      if ( typeof listeners[ type ] === 'undefined' ) {

        listeners[ type ] = [];

      }

      if ( listeners[ type ].indexOf( listener ) === - 1 ) {

        listeners[ type ].push( listener );

      }

    };

    /**
     * @method hasEventListener
     * @param {string} type event type
     * @param {function} listener event handler
     * @return {boolean} event type へ listener 登録が有るか無いかの真偽値を返します
     */
    p.hasEventListener = function ( type, listener ) {

      var listeners = this._listeners;

      if ( typeof listeners === 'undefined') {

        return false;

      } else if ( typeof listener[ type ] !== 'undefined' && listeners[ type ].indexOf( listener ) !== - 1 ) {

        return true;

      }

      return false;

    };

    /**
     * event type から listener を削除します
     *
     * メモリーリークの原因になるので不要になったlistenerは必ずremoveEventListenerを実行します
     *
     * @method removeEventListener
     * @param {string} type event type
     * @param {function} listener event handler
     */
    p.removeEventListener = function ( type, listener ) {

      this.off( type, listener );

    };
    /**
     * removeEventListener alias
     * @method off
     * @param {string} type event type
     * @param {function} listener event handler
     */
    p.off = function ( type, listener ) {

      var
        listeners = this._listeners,
        listenersTypes,
        index;

      if ( typeof listeners === 'undefined') {

        return;

      }

      listenersTypes = listeners[ type ];

      if ( typeof listenersTypes !== 'undefined' ) {

        index = listenersTypes.indexOf( listener );

        if ( index !== -1 ) {

          listenersTypes.splice( index, 1 );

        }

      }

    };

    /**
     * event発生をlistenerに通知します
     *
     * @method dispatchEvent
     * @param {Object} event require event.type:String, { type: 'some_event', [] }
     */
    p.dispatchEvent = function ( event ) {

      var
        listeners = this._listeners,
        listenersTypes,
        listener,
        i, limit;

      if ( typeof listeners === 'undefined' || typeof event.type === 'undefined' ) {

        return;

      }

      listenersTypes = listeners[ event.type ];

      if ( typeof listenersTypes !== 'undefined' ) {

        event.target = this;

        for ( i = 0, limit = listenersTypes.length; i < limit; i = ( i + 1 )|0 ) {

          listener = listenersTypes[ i ];

          if ( !!listener ) {

            listener.call( this, event );

          }

        }
      }

    };

    /**
     * ## EventDispatcher mixin
     *
     * 6関数を引数(object)へ追加します
     *
     * - addEventListener
     * - hasEventListener
     * - removeEventListener
     * - dispatchEvent
     * - on
     * - off
     *
     *
     *      function SomeClass () {}
     *      // mixin
     *      Gasane.EventDispatcher.initialize( SomeClass.prototype );
     *
     *      var someObject = {};
     *      // mixin
     *      Gasane.EventDispatcher.initialize( someObject );
     *
     * @method initialize
     * @param {Object} object
     * @static
     */
    EventDispatcher.initialize = function ( object ) {

      object.addEventListener = p.addEventListener;
      object.on = p.on;
      object.hasEventListener = p.hasEventListener;
      object.removeEventListener = p.removeEventListener;
      object.off = p.off;
      object.dispatchEvent = p.dispatchEvent;

    };

    return EventDispatcher;
  }() );
}( window ) );

///**
// * license inazumatv.com
// * author (at)taikiken / http://inazumatv.com
// * date 15/09/24 - 11:50
// *
// * Copyright (c) 2011-2015 inazumatv.com, inc.
// *
// * Distributed under the terms of the MIT license.
// * http://www.opensource.org/licenses/mit-license.html
// *
// * This notice shall be included in all copies or substantial portions of the Software.
// *
// */
/*jslint -W016*/
/**
 * cue point helper
 *
 * @type {Cue}
 */
( function ( window ) {

  'use strict';

  window.Doga.Cue = ( function () {

    /**
     * cue point を管理します
     * @class Cue
     * @constructor
     */
    function Cue () {

      /**
       * @property points
       * @type {Array}
       */
      this.points = [];

      this.cue = {};

    }

    var p = Cue.prototype;
    p.constructor = Cue;

    /**
     * cue point start ~ end 範囲を計算します
     *
     * cue point event 発行に必要なので必ず実行してください
     *
     * @method init
     */
    p.init = function () {

      var
        points = this.points,
        cue = this.cue,
        point,
        prev,
        i, limit;

      for ( i = 0, limit = points.length; i < limit; i = (i + 1)|0 ) {

        point = points[ i ];


        if ( !cue.hasOwnProperty( point ) ) {

          cue[ point ] = {
            start: point,
            end: null,
            fire: false
          };


        } else {

          cue[ point ].end = point;

        }


        if ( !!prev ) {

          cue[ prev ].end = point;

        }

        prev = point;

      }

      cue[ point ].end = Number.MAX_VALUE;


    };

    /**
     * cue point fired option を false へ
     * @method reset
     * @param {Number} index
     */
    p.reset = function ( index ) {

      var
        points = this.points,
        cue = this.cue,
        point, i, limit;

      for ( i = index, limit = points.length; i < limit; i = (i + 1)|0 ) {

        point = points[ i ];

        if ( cue.hasOwnProperty( point ) ) {

          cue[ point ].fire = false;

        }

      }

    };

    /**
     * cue point fired option を 全て false へ
     * @method resetAll
     */
    p.resetAll = function () {

      this.reset( 0 );

    };

    /**
     * @method resetUnder
     * @param {Number} index
     */
    p.resetUnder = function ( index ) {

      var
        points = this.points,
        cue = this.cue,
        limit = points.length - 1,
        i = Math.min( index, limit ),
        point;

      for ( ; i >= 0; i = (i - 1)|0 ) {

        point = points[ i ];

        if ( !!point ) {

          if ( cue.hasOwnProperty( point ) ) {

            cue[ point ].fire = false;

          }

        }

      }

    };

    /**
     * cue point 未達で event 発行可能かを判定します
     * @method canFire
     * @param {Number} time cue point time
     * @return {boolean} event 発行可能な場合 true を返します
     */
    p.canFire = function ( time ) {

      var
        one = this.cue[ time ],
        result = false;

      if ( !!one ) {

        result = one.fire;

      }

      return result;

    };

    /**
     * cue point event 発行済みをマークします
     * @method fired
     * @param {Number} time cue point time
     */
    p.fired = function ( time ) {

      this.cue[ time ].fire = true;

    };

    /**
     * video current time が cue point event 発行可能エリアにいるかを判定します
     * @method insect
     * @param {Number} time video current time
     * @return {*|undefined} {{start: number, end:number, fire: boolean}}
     */
    p.insect = function ( time ) {

      var
        points = this.points,
        cue = this.cue,
        //found = false,
        //founded = 0,
        result,
        //key,
        cueTime,
        point,
        i, limit;

      for ( i = 0, limit = points.length; i < limit; i = (i + 1)|0 ) {

        cueTime = points[ i ];

        if ( cueTime > time ) {

          break;

        }

        point = cue[ cueTime ];

        if ( time >= point.start && time < point.end ) {

          result = point;
          break;

        }

      }

      return result;

    };

    /**
     * @method length
     * @return {Number}
     */
    p.length = function () {

      return this.points.length;

    };
    /**
     * @method index
     * @param {Number|String} time
     * @return {Number}
     */
    p.index = function ( time ) {

      time = time * 1;

      return this.points.indexOf( time );

    };
    /**
     * @method has
     *  @param {Number|String} time
     * @return {boolean}
     */
    p.has = function ( time ) {

      return this.index( time ) !== -1;

    };
    /**
     * @method range
     * @param {Number} start
     * @param {Number=Number.MAX_VALUE} [end]
     * @return {boolean}
     */
    p.range = function ( start, end ) {

      var
        points = this.points,
        result = false,
        point,
        i, limit;

      end = end || Number.MAX_VALUE;

      for ( i = 0, limit = points.length; i < limit; i = (i + 1)|0 ) {

        point = points[ i ];
        if ( point >= start && point <= end ) {

          result = true;
          break;

        }

      }

      return result;

    };
    /**
     * @method add
     * @param {Number|String} time
     */
    p.add = function ( time ) {

      time = time * 1;

      if ( !this.has( time ) ) {

        this.points.push( time );
        this.sort();

      }

    };
    /**
     * @method remove
     * @param {Number|String} time
     */
    p.remove = function ( time ) {

      time = time * 1;

      var
        index = this.index( time );

      if ( index !== -1 ) {

        this.points.slice( index, 1 );
        this.sort();

      }

    };
    /**
     * @method sort
     */
    p.sort = function () {

      if ( this.length() > 1 ) {

        this.points.sort( function ( a, b ) { return a - b; } );

      }

    };
    /**
     * @method next
     * @param {Number} index
     * @return {Number|null}
     */
    p.next = function ( index ) {

      var
        result = null;

      if ( index !== -1 ) {

        index = index + 1;

        if ( index < this.length() ) {

          result = this.points[ index ];

        }

      }

      return result;

    };
    /**
     * @method nextByTime
     * @param {Number} time
     * @return {Number|null}
     */
    p.nextByTime = function ( time ) {

      return this.next( this.index( time ) );

    };

    /**
     * @method distance
     * @param {number} time
     * @return {{start: number, end: number}}
     */
    p.distance = function ( time ) {

      var
        points = this.points,
        startTime = 0,
        results,
        point,
        i, limit;

      for ( i = 0, limit = points.length; i < limit; i = (i + 1)|0 ) {

        point = points[ i ];

        if ( point >= time ) {

          results = {
            start: startTime,
            end: point
          };

          break;

        }

        startTime = point;

      }

      return results;

    };
    /**
     * @method prev
     * @param {Number} index
     * @return {Number|null}
     */
    p.prev = function ( index ) {

      var
        result = null;

      if ( index !== -1 ) {

        index = index - 1;

        if ( index >= 0 ) {

          result = this.points[ index ];

        }

      }

      return result;

    };
    /**
     * @method prevByTime
     * @param {Number} time
     * @return {Number|null}
     */
    p.prevByTime = function ( time ) {

      return this.prev( this.index( time ) );

    };

    return Cue;

  }() );

}( window ) );
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