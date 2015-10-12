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
          // todo: figure out if there is a callback after loading a view
          // dom for the loaded view isn't technically ready so we're doing this nonsense
          if ($(".chart").length > 0) {
            render_bar_charts();
            $('.grid-rows').each(function(){
              var row_editor = new RowEditor($(this));
              row_editor.init();
              row_editor.onSubmit($(this), function(e) {
                sharedProperties.setProjects({
                });
              });
            });
            clearInterval(checkContents);
          }
        }, 100);
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