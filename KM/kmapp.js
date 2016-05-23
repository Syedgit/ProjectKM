angular.module('keyMeasuresApp').directive('kmMetricValueCellValue', function (KmConstants) {
    'use strict';

    return {
        require: ['^kmMetricValueInputGrid', 'kmMetricValueCellValue'],
        restrict: 'E',
        scope: {
            gridReadOnly: '=oGridReadOnly',
            metricInstanceId: '=oMetricInstanceId',
            metricValueDate: '=oMetricValueDate'
        },
        templateUrl: 'views/partials/metricvalue/metricValueCellValue.html',
        bindToController: true,
        controllerAs: 'ctrl',
        controller: function () {
        },
        link: function (scope, el, attrs, controllers) {
            var kmMetricValueInputGridCtrl = controllers[0];
            var ctrl = controllers[1];

            function updateCellReadOnly() {
                if (ctrl.gridReadOnly) {
                    ctrl.cellReadOnly = true;
                    return;
                }
                if (ctrl.metricValue.inputType === KmConstants.metricValue.inputTypeNumeratorDenominator) {
                    ctrl.cellReadOnly = true;
                    return;
                }
                if (ctrl.metricValue.statusLookupCode === KmConstants.metricValue.statusPending) {
                    ctrl.cellReadOnly = true;
                    return;
                }
                if (ctrl.metricValue.ndtrFlag === 'Y') {
                    ctrl.cellReadOnly = true;
                    return;
                }
                ctrl.cellReadOnly = false;
            }

            var metricValueCtrl = kmMetricValueInputGridCtrl.getMetricValueCtrl({
                metricInstanceId: ctrl.metricInstanceId,
                metricValueDate: ctrl.metricValueDate
            });

            function setMetricValue(metricValue) {
                ctrl.metricValue = metricValue;
                updateCellReadOnly();
            }
            metricValueCtrl.subscribe(setMetricValue);
            scope.$on('$destroy', function () {
                metricValueCtrl.unsubscribe(setMetricValue);
            });

            function onChange() {
                ctrl.metricValue.calculatedValue = null;
                metricValueCtrl.setMetricValue(ctrl.metricValue);
            }
            scope.onChange = onChange;
        }
    };
});
