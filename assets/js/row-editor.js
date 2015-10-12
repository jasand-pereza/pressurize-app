
RowEditor = (function($, window) {
  'use strict';

  var RowEditor = function ($object) {
    this.$object = $object;
  };
  RowEditor.prototype.init = function() {
    this.template = this.getTemplate(function(template) {
      this.addRows(1, template);
      var $obj = this.$object.find('.row-editor');
      this.addEvents($obj);
    }.bind(this));
  };

  RowEditor.prototype.addRows = function(n, template) {
    for(var i = 0; i < n; i++) {
      this.$object.append(template);
    }
  };

  RowEditor.prototype.addEvents = function() {
    
  };

  RowEditor.prototype.onSubmit = function($obj, callback) {
    $obj.on('submit', function(e) {
      e.preventDefault();
      callback(e);
    });
  };

  RowEditor.prototype.getTemplate = function(callback) {
    return (function() {
      $.get('/partials/projects-row-editor.html')
        .done(function(d) {
          callback(d);
        });
    })();
  };
  return RowEditor;
})(jQuery, window);