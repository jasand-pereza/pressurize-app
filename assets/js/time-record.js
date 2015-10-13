TimeRecord = (function($, window) {
  'use strict';

  var TimeRecord = function (data) {

    if(typeof data.hours == 'undefined') return;
    data.hours = parseInt(data.hours);
    this.hours = data.hours;
    this.project_number = data.project_number;

    if(typeof data.comments) {
      this.comments = $.trim(data.comments);
    }
  };

  TimeRecord.prototype = {
    hours : 0,
    comments: '',
    project_number: null
  };

  return TimeRecord;
})(jQuery, window);