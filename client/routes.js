/**
 * Created by priv on 29.01.16.
 */

angular.module('app').config(function($urlRouterProvider, $stateProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
    .state('home_page', {
        url:'/'
    })
    .state('admin_clients', {
    url:'/admin/client/list',
    template:'<clients-list></clients-list>'
    })
    .state('admin_client_create', {
        url:'/admin/client/create',
        template:'<create-client></create-client/>'
    })
    .state('admin_client_edit', {
        url:'/admin/client/edit/:clientId',
        template:'<edit-client></edit-client>'
    });

    $urlRouterProvider.otherwise('/');

}).run(function ($rootScope, $state, $timeout) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        if (error === 'AUTH_REQUIRED') {
            $state.go('parties');
        }
    });

    Accounts.onLogin(function () {
        var userRole = Meteor.user().roles[0];
        if(userRole === 'admin') {
            //TODO blog post
            $timeout(function() {
                $state.go('admin_clients');
            },0);
        } else if(userRole === 'user') {
            $timeout(function() {
                $state.go('home_page');
            },0);
        }
    });
});