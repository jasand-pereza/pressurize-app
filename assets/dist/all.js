var render_bar_charts = function() {

  $('.chart').each(function (i, svg) {
    var $svg = $(svg);
    var data_hours = [parseInt($svg.data('dataHours'))];
    var data_hours_used = [parseInt($svg.data('dataHoursUsed'))];

    var barWidth = parseFloat($svg.data('bar-width')) || 15;
    var barSpace = parseFloat($svg.data('bar-space')) || 0.5;
    var chartHeight = $svg.outerHeight();

    var y_used = d3.scale.linear()
    .domain([0, data_hours])
    .range([0, 150]);

    var y = d3.scale.linear()
    .domain([0, chartHeight])
    .range([0, data_hours]);

    d3.select(svg)
    .append('g')
    .selectAll(".bar-hours")
    .data(data_hours)
    .enter().append("rect")
    .attr("class", "bar-hours")
    .attr("width", barWidth)
    .attr("x", function (d, i) { return barWidth*i + barSpace*i; })
    .attr("y", chartHeight)
    .attr("height", chartHeight)
    .attr("y", 0);

    d3.select(svg)
    .selectAll('g')
    .selectAll(".bar-used")
    .data(data_hours_used)
    .enter().append("rect")
    .attr("class", "bar-used")
    .attr("width", barWidth)
    .attr("x", function (d, i) { return barWidth*i + barSpace*i; })
    .attr("y", chartHeight)
    .attr("height", 0)
    .transition()
    .delay(function (d, i) { return i*100; })
    .attr("y", function (d, i) { return chartHeight-y_used(d); })
    .attr("height", function (d) { return y_used(d); })
    .attr('fill', function(d, i) {
      return getGreenToRed((d/data_hours[i]) * 100);
    });

  });
};

function getGreenToRed(percent){
  g = percent< 50 ? 255 : Math.floor(255-(percent*2-100)*255/100);
  r = percent>50 ? 255 : Math.floor((percent*2)*255/100);
  return 'rgb('+r+','+g+',0)';
}

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