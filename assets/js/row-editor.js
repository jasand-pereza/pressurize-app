
RowEditor = (function($, window) {
  'use strict';

  var RowEditor = function ($object) {
    this.$object = $object;
  };
  RowEditor.prototype.init = function() {
    this.addEvents($obj);
  };


  return RowEditor;
})(jQuery, window);