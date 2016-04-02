/**
 * Created by priv on 25.01.16.
 */

angular.module("app").directive('clientsList', function() {
    return {
        restrict:'E',
        templateUrl:'client/admin/clients/list.html',
        controllerAs:'clientsList',
        controller:function($scope, $reactive, $location) {
            $reactive(this).attach($scope);

            var pageLimit = 10;
            var pagesShown = 1;

            this.subscribe('clients');

            this.helpers({
                clients: () => {
                    return Clients.find({}, {sort:{createdAt:-1}});
                }
            });

            //TODO - find out why search is present in scope but is not present in this
            this.filterClients = function (client) {
                return (angular.lowercase(client.companyName).indexOf(angular.lowercase($scope.search) || '') !== -1 ||
                    angular.lowercase(client.firstName).indexOf(angular.lowercase($scope.search) || '') !== -1) ||
                    angular.lowercase(client.lastName).indexOf(angular.lowercase($scope.search) || '') !== -1;
            };

            this.pageLimit = function() {
                return pageLimit * pagesShown;
            };

            this.hasMoreClientsToShow = function() {
                return pagesShown < (this.clients.length / pageLimit);
            };

            this.showMoreClients = function() {
                pagesShown = pagesShown + 1;
                var $target = $('html,body');
                $target.animate({scrollTop: $target.height()}, 1000);
            };

            this.createClient = function() {
                $location.path('/admin/client/create');
            };
        }
    }
});

angular.module("app").directive('createClient', function() {
    return {
        restrict:'E',
        templateUrl:'client/admin/clients/create.html',
        controllerAs:'clientCreate',
        controller:function($scope, $reactive, $location, $stateParams) {
            $reactive(this).attach($scope);

            this.newClient = {};

            this.save = function() {
                createNewClient(this.newClient);
            };

            function createNewClient(newClient) {
                if(newClient.logoId) {
                    var image = newClient.logoId[0];
                    var reader = new FileReader();
                    reader.onload = (function(image) {
                        return function(event) {
                            Meteor.call('uploadImage', reader.result, image.name, image.size,
                                function(error, result) {
                                    newClient.logoId = result;
                                    saveClient(newClient);
                                }
                            );
                        };
                    })(image);
                    reader.readAsDataURL(image);
                } else {
                    saveClient(newClient);
                }
            }

            function saveClient(newClient) {
                newClient.createdAt = new Date();
                Clients.insert(newClient);
                $location.path('/admin/client/list');
                $scope.$apply();
            }
        }
    }
});

angular.module("app").directive('editClient', function() {
    return {
        restrict:'E',
        templateUrl:'client/admin/clients/edit.html',
        controllerAs:'editClient',
        controller:function($scope, $reactive, $location, $stateParams) {
            $reactive(this).attach($scope);

            this.subscribe('clients');
            this.subscribe('images');

            this.helpers({
                client: () => {
                    var client = Clients.findOne({_id:$stateParams.clientId});
                    if(client && client.logoId) {
                        var logo = Images.findOne({_id:client.logoId});
                        if(logo) {
                            client.logo = logo;
                        }
                    }
                    client.logoId = [];
                    return client;
                }
            });

            this.save = function() {
                updateClient(this.client);
            };

            function updateClient(client) {
                var oldImage = client.logo;
                var newImage = client.logoId[0];
                if(newImage && oldImage.name != newImage.name && oldImage.size != newImage.size) {
                    var reader = new FileReader();
                    reader.onload = (function(image) {
                        return function(event) {
                            Meteor.call('uploadImage', reader.result,
                                image.name, image.size, function(error, result) {
                                    updateClientWithLogo(error, result, client)
                                });
                        };
                    })(newImage);
                    reader.readAsDataURL(newImage);
                } else {
                    updateClientWithoutLogo(client);
                }
            }

            function updateClientWithLogo(error, result, client) {
                client.logoId = result;
                Clients.update({_id : client._id},
                    {
                        $set:{
                            firstName: client.firstName,
                            lastName: client.lastName,
                            companyName: client.companyName,
                            phoneNumber: client.phoneNumber,
                            email: client.email,
                            logoId: client.logoId,
                            updatedAt: new Date()
                        }
                    }
                );
                $location.path('/admin/client/list');
                $scope.$apply();
            }

            function updateClientWithoutLogo(client) {
                Clients.update({_id : client._id},
                    {
                        $set:{
                            firstName: client.firstName,
                            lastName: client.lastName,
                            companyName: client.companyName,
                            phoneNumber: client.phoneNumber,
                            email: client.email,
                            updatedAt: new Date()
                        }
                    }
                );
                $location.path('/admin/client/list');
            }
        }
    }
});