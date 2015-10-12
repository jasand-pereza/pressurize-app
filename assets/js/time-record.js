TimeRecord = (function($, window) {
  'use strict';

  var TimeRecord = function ($object, data) {
    this.$object = $object;

    if(typeof data.hours !== 'number') return;
    this.hours = data.hours;

    if(typeof data.comments) {
      this.comments = $.trim(data.comments);
    }
  };

  TimeRecord.prototype = {
    hours : 0,
    comments: ''
  };

  return TimeRecord;
})(jQuery, window);