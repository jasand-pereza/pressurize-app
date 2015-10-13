(function($, angular, window) {
  'use strict';
  
  var pressurizeApp = angular.module('pressurizeApp', ['ngRoute']);

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

  
  pressurizeApp.service('sharedProperties', function () {
    var projects = (localStorage.getItem('projects')!==null) ? JSON.parse(localStorage.getItem('projects')) : [];
    var time_records = (localStorage.getItem('time_records')!==null) ? JSON.parse(localStorage.getItem('time_records')) : [];

    return {
      getProjects: function () {
        projects = _.filter(projects, function(p) {
          if(typeof p.name != 'undefined') {
            return p;
          }
        });
        return projects;
      },
      setProjects: function(array_projects) {
        projects.push(array_projects);
        projects = _.filter(projects, function(p) {
          if(typeof p.name != 'undefined') {
            return p;
          }
        });
        var string_projects = JSON.stringify(projects, function (key, val) {
          if (key == '$$hashKey') {
            return undefined;
          }
          return val;
        });
        localStorage.setItem('projects', string_projects);
      },
      updateProjects: function(array_projects) {
        this.setProjects(array_projects);
      },
      getTimeRecords: function() {
        time_records = _.filter(time_records, function(p) {
          if(typeof p.name != 'undefined') {
            return p;
          }
        });
        return time_records;
      },
      setTimeRecords: function(array_time_records) {
        time_records.push(array_time_records);
        time_records = _.filter(time_records, function(t) {
          if(typeof t.hours != 'undefined') {
            return t;
          }
        });
        var string_time_records = JSON.stringify(time_records, function (key, val) {
          if (key == '$$hashKey') {
            return undefined;
          }
          return val;
        });
        localStorage.setItem('time_records', string_time_records);
      }
    };
  });

  pressurizeApp.controller('ProjectsListController', ["$scope", "$http", "sharedProperties",
    function ($scope, $http, sharedProperties) {
      $scope.projects = sharedProperties.getProjects();
      $scope.init = function() {

        var checkContents = setInterval(function() {
          // todo: figure out if there is a callback after loading a view
          // the dom for the loaded view isn't technically ready so we're doing this nonsense
          if ($(".chart").length > 0) {
            render_bar_charts();
            clearInterval(checkContents);
          }
        }, 100);
      };
    }
  ]);

  pressurizeApp.controller('TimeRecordsController', ["$scope", "$http", "sharedProperties", "$compile",
    function ($scope, $http, sharedProperties, $compile) {
      $scope.time_record = {};

      $scope.timeRecordSubmit = function(is_valid) {
        if(!is_valid) {
          alert('please fill out required fields');
        }
        var time_record = new TimeRecord($scope.time_record);
        var project = _.findWhere(
          sharedProperties.getProjects(),
          { '$$hashKey': $scope.time_record.project_number }
        );
        
        project.total_used = parseInt(project.total_used) + parseInt(time_record.hours);
        var all_projects = sharedProperties.getProjects();
       
        all_projects = _.map(function(p) {
          if(p.$$hashKey == time_record.project_number) {
            return p;
          }
        });
        sharedProperties.updateProjects(all_projects);

        sharedProperties.setTimeRecords({
          hours: time_record.hours,
          comments: time_record.comments,
          project_number: time_record.project_number
        });
      };
    }
  ]);


  pressurizeApp.controller('ProjectCreateController', ["$scope", "$http", "sharedProperties",
    function ($scope, $http, sharedProperties) {

      $scope.project = {};
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
    }
  ]);

})(jQuery, angular, window);