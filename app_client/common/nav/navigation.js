var app = angular.module('bloggerApp');

//*** Directives ***
app.directive('navigation', function navigation() {
    return {
        restrict: 'EA',
        templateUrl: '/common/nav/navigation.html',
        controller: 'NavigationController as navvm',
    };
});

//*** Controller ***
app.controller('NavigationController', [ '$location', 'authentication', function NavigationController( $location, authentication){
    var vm = this;
    vm.currentPath = $location.path();
    vm.currentUser = function() {
        return authentication.currentUser();
    }

    vm.isLoggedIn = function() {
        return authentication.isLoggedIn();
    }
    vm.logout = function() {
        authentication.logout();
        $location.path('/');
    };
}]);