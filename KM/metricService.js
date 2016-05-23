angular.module('keyMeasuresApp').factory('MetricSearchService', function ($http) {
    'use strict';
    return {
        quickSearch: function (requestData) {
            return $http.post('app/performQuickSearch', requestData)
                .then(function (response) {
                    return response.data;
                });
        },
        search: function (metricsearch) {
            return $http.post('app/performSearch/', metricsearch);
        }
    };
});
