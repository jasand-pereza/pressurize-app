(function($, angular, App, window) {
  'use strict';
  

 
  var pressurizeApp = angular.module('pressurizeApp', ['ngRoute']);
  
  pressurizeApp.factory('uuid', function() {
    var svc = {
      new: function() {
        function _p8(s) {
          var p = (Math.random().toString(16)+"000000000").substr(2,8);
          return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
      },

      empty: function() {
        return '00000000-0000-0000-0000-000000000000';
      }
    };
    return svc;
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
          if(typeof p.hours != 'undefined') {
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

      $scope.getProjectAssoicatedTimeRecords = function(id) {
        var time_records = _.where(
          sharedProperties.getTimeRecords(),
          { project_number:  id }
        );
        if(!_.isArray(time_records)) {
          return [time_records];
        }
        return time_records;
      };

      $scope.init = function() {

        var checkContents = setInterval(function() {
          // todo: figure out if there is a callback after loading a view
          // the dom for the loaded view isn't technically ready so we're doing this nonsense
          if ($(".chart").length > 0) {
            App.renderBarCharts();
            clearInterval(checkContents);
          }
        }, 100);
      };
    }
  ]);

  pressurizeApp.controller('TimeRecordsController', ["$scope", "$http", "sharedProperties",
    function ($scope, $http, sharedProperties) {
      $scope.time_record = {};

      $scope.timeRecordSubmit = function(is_valid) {
        if(!is_valid) {
          alert('please fill out required fields');
        }
        var time_record = new TimeRecord($scope.time_record);
        var project = _.findWhere(
          sharedProperties.getProjects(),
          { 'project_number': $scope.time_record.project_number }
        );
        // todo: refactor/extract all the below
        project.total_used = parseInt(project.total_used) + parseInt(time_record.hours);
        var all_projects = sharedProperties.getProjects();
       
        all_projects = _.map(function(p) {
          if(p.project_number == time_record.project_number) {
            return p;
          }
        });
        sharedProperties.updateProjects(all_projects);

        sharedProperties.setTimeRecords({
          hours: time_record.hours,
          comments: time_record.comments,
          project_number: time_record.project_number
        });
        window.location = '/#/projects';
      };
    }
  ]);

  pressurizeApp.controller('ProjectCreateController', ["$scope", "$http", "sharedProperties", "uuid",
    function ($scope, $http, sharedProperties, uuid) {

      $scope.project = {};

      $scope.submitForm = function(is_valid) {
        
        if(!is_valid) {
          alert('please fill out all fields correctly');
        }

        $scope.project.total_used = (typeof $scope.project.total_used  != 'undefined') ? $scope.project.total_used : 0;


        sharedProperties.setProjects({
          name: $scope.project.name,
          project_number: uuid.new(),
          description: $scope.project.description,
          dev_hours: $scope.project.dev_hours,
          total_used: $scope.project.total_used,
        });
        alert('project created!');
        window.location = '/#/projects';
      };
    }
  ]);
})(jQuery, angular, App, window);