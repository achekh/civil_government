'use strict';

angular.module('mean.victories')
    .controller('VictoriesController', ['$scope', '$state', '$stateParams', '$http', 'Victories',
        function($scope, $state, $stateParams, $http, Victories) {

            $scope.package = {
                name: 'victories'
            };


            (function initRegions(){
                $scope.regions = [
                    {'value': '0.Вся Україна', 'label': 'Вся Україна'}
                ];
                $scope.region = $scope.regions[0];
                $http({method: 'GET', url: '/regions'}).
                    success(function(data, status, headers, config) {
                        $scope.regions = data;
                        $scope.region = $scope.regions.filter(function (region) {
                            return '' + region.value === '' + $stateParams.region;
                        })[0] || $scope.regions[0];
                    });
            })();

            $scope.setRegion = function (region) {
                $scope.region = region;
                $scope.find();
            };

            $scope.find = function find(){
                Victories.query({region: $scope.region.value.indexOf('0.') === 0 ? undefined : $scope.region._id}, function(victories) {
                    $scope.victories = victories;
                });
            };

            $scope.getVictoryImageUrl = function getVictoryImageUrl(victory) {
                if (victory)
                    return String(victory.img).indexOf('http://') === 0 || String(victory.img).indexOf('https://') === 0 ?
                        victory.img :
                        'http://dummyimage.com/100x100/858585/' + victory.img;
                else
                    return '';
            };

            $scope.init = function init() {
                if ($stateParams.victoryId) {
                    Victories.get({victoryId:$stateParams.victoryId}, function(victory) {
                        $scope.victory = victory;
                    });
                } else {
                    $scope.victory = new Victories();
                }
            };

            $scope.getCreateEditTitle = function getCreateEditTitle() {
                if ($stateParams.victoryId) {
                    if ($scope.isView()) {
                        return 'Просмотр победы';
                    } else {
                        return 'Редактирование победы';
                    }
                } else {
                    return 'Создание победы';
                }
            };

            $scope.cancel = function cancel() {
                $state.goBack();
            };

            $scope.save = function save() {
                if ($scope.victory._id) {
                    $scope.victory.$update(function(victory) {
                        $state.goBack();
                    });
                } else {
                    $scope.victory.$save(function(victory) {
                        $state.goBack();
                    });
                }
            };

            $scope.isView = function() {
                if ($scope.victory && $scope.victory._id && $scope.victory.user && $scope.global && $scope.global.user && $scope.global.user._id === $scope.victory.user._id) {
                    return false;
                } else if ($scope.victory && !$scope.victory._id) {
                    return false;
                } else {
                    return true;
                }
            };

            $scope.remove = function (victory) {
                if (victory) {
                    victory.$remove(function (response) {
                        if (!response.errors) {
                            for (var i in $scope.victories) {
                                if ($scope.victories[i] === victory) {
                                    $scope.victories.splice(i, 1);
                                }
                            }
                        }
                    });
                } else {
                    $scope.victory.$remove(function (response) {
                        $state.goBack();
                    });
                }
            };

            (function loadGoogleMapsApiScript() {
                window.initializeGoogleMapsApi4Victory = function () {
                    $scope.geocoder = new window.google.maps.Geocoder();
                    function getCityFromSuggestion(suggestion) {
                        for (var i in suggestion.address_components) {
                            var address_component = suggestion.address_components[i];
                            if (address_component.types.indexOf('locality') > -1) {
                                return address_component.long_name;
                            }
                        }
                    }
                    function setCityFromSuggestion(suggestion) {
                        var city = getCityFromSuggestion(suggestion);
                        $scope.victory.city = city;
                        $scope.suggestions = {};
                    }
                    function getRegionFromSuggestion(suggestion) {
                        for (var i in suggestion.address_components) {
                            var address_component = suggestion.address_components[i];
                            if (address_component.types.indexOf('administrative_area_level_1') > -1) {
                                return address_component.long_name;
                            }
                        }
                    }
                    function getRegionByRegionLabel(regionLabel) {
                        if (regionLabel) {
                            for(var i in $scope.regions) {
                                if ($scope.regions[i].label === regionLabel) {
                                    return $scope.regions[i];
                                }
                            }
                            var region = {value: regionLabel, label: regionLabel};
                            var promise = $http({method: 'PUT', url: '/regions', data: region})
                                .success(function(region){
                                    if (region) {
                                        $scope.regions.push(region);
                                    }
                                });
                            return promise;
                        }
                    }
                    function setRegionFromSuggestion(suggestion) {
                        function setResolvedRegion(region) {
                            region = (region && region.data) ? region.data : region;
                            $scope.victory.region = (region && region._id) ? region._id : null;
                        }
                        var regionLabel = getRegionFromSuggestion(suggestion);
                        var region = getRegionByRegionLabel(regionLabel);
                        if (region && region.then) {
                            region.then(setResolvedRegion);
                        } else {
                            setResolvedRegion(region);
                        }
                    }

                    $scope.$watch('victory.city', function(v,p,s) {
                        if (v && p && v !== p) {
                            $scope.geocoder.geocode({
                                'address': $scope.victory.city,
                                region: 'UA',
                                componentRestrictions: {
                                    country: 'UA'
                                }
                            }, function(results, status) {
                                if (status === window.google.maps.GeocoderStatus.OK) {
                                    $scope.suggestions = {};
                                    var firstSuggestion;
                                    results.forEach(function(suggestion) {
                                        suggestion.city = getCityFromSuggestion(suggestion);
                                        if (!firstSuggestion) firstSuggestion = suggestion;
                                        if (suggestion.city && suggestion.city !== v) {
                                            $scope.suggestions[suggestion.city] = suggestion;
                                        }
                                    });
                                    if (firstSuggestion && firstSuggestion.city) {
                                        setRegionFromSuggestion(firstSuggestion);
                                    } else {
                                        $scope.victory.region = null;
                                    }
                                    $scope.$apply();
                                }
                            });
                        }
                    });
                    $scope.suggestions = {};
                    $scope.selectSuggestion = function(suggestion) {
                        setCityFromSuggestion(suggestion);
                        setRegionFromSuggestion(suggestion);
                    };
                };
                if (!window.google) {
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = '//maps.googleapis.com/maps/api/js?language=uk&region=UA' + '&callback=initializeGoogleMapsApi4Victory';
                    window.document.body.appendChild(script);
                } else {
                    window.initializeGoogleMapsApi4Victory();
                }
            })();

        }
    ])
;
