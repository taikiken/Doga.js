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