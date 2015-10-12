var pressurizeApp = angular.module('pressurizeApp', ['ngRoute'])
.service('sharedProperties', function () {
  var projects = (localStorage.getItem('projects')!==null)
    ? JSON.parse(localStorage.getItem('projects'))
    : [];

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
        redirectTo: '/projects'
      });
  }]);

pressurizeApp.controller('ProjectsListController', ["$scope", "$http", "sharedProperties",
  function ($scope, $http, sharedProperties) {
    $scope.projects = sharedProperties.getProjects();

    $scope.renderBarCharts = function() {
      var checkContents = setInterval(function(){
        if ($(".chart").length > 0){ // Check if element has been found
          render_bar_charts();
          clearInterval(checkContents);
        }
      },1000);
    };
    $scope.renderBarCharts();
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