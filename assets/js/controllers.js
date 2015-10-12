(function($, angular, window) {
  'use strict';

  var pressurizeApp = angular.module('pressurizeApp', ['ngRoute'])
  .service('sharedProperties', function () {
    var projects = (localStorage.getItem('projects')!==null) ? JSON.parse(localStorage.getItem('projects')) : [];

    return {
      getProjects: function () {
        return projects;
      },
      setProjects: function(array_projects) {
        projects.push(array_projects);
        var string_projects = JSON.stringify(projects, function (key, val) {
          if (key == '$$hashKey') {
            return undefined;
          }
          return val;
        });
        localStorage.setItem('projects', string_projects);
      }
    };
  });

  pressurizeApp.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/projects/', {
            templateUrl: 'partials/projects-list.html',
            controller: 'ProjectsListController'
          }
        ).
        when('/projects/create/', {
          templateUrl: 'partials/projects-create.html',
          controller: 'ProjectCreateController'
        }).
        otherwise({
          redirectTo: '/projects/'
        });
    }]);

  pressurizeApp.controller('ProjectsListController', ["$scope", "$http", "sharedProperties",
    function ($scope, $http, sharedProperties) {
      $scope.projects = sharedProperties.getProjects();


      $scope.init = function() {
        var checkContents = setInterval(function() {
          if ($(".chart").length > 0) { // Check if element has been found
            render_bar_charts();
            var row_editor = new RowEditor($('.grid-rows'));
            row_editor.init();
            row_editor.onSubmit(function(e) {
              sharedProperties.setProjects({
                
              });
            });
            clearInterval(checkContents);
          }
        }, 10);
      };
  }]);


  pressurizeApp.controller('ProjectCreateController', ["$scope", "$http", "sharedProperties",
    function ($scope, $http, sharedProperties) {
      
      $scope.project = [];
      $scope.submitForm = function(is_valid) {
        
        if(!is_valid) {
          alert('please fill out all fields correctly');
        }

        sharedProperties.setProjects({
          name: $scope.project.name,
          description: $scope.project.description,
          dev_hours: $scope.project.dev_hours,
          total_used: $scope.project.total_used,
        });
        alert('project created!');
        window.location = '/#/projects';
      };
  }]);

})(jQuery, angular, window);


RowEditor = (function($) {
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
})(jQuery);