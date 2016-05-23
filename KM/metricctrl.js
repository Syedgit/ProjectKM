angular.module('keyMeasuresApp').controller('MetricInstanceValuesCtrl', function ($log, $uibModal, $rootScope, $scope, MetricInstanceService, MetricValueService, MetricInstanceValuesConfig) {
    'use strict';

    $log.info('Metric Instance Values Controller initialized');

    $log.debug('Metric Instance Request', MetricInstanceService.metricInstanceRequest);
    $log.debug('Metric Base Properties For Display', MetricInstanceService.metricBasePropertiesForDisplay());

    function isLocked() {
        function isInstanceManualEntry() {
            return MetricInstanceService.metricInstanceRequest.valueSourceLookupCode === 'KM_INST_MANL_ENTR';
        }
        function isInstanceInDevelopment() {
            return MetricInstanceService.metricInstanceRequest.instanceStatus === 'KM_INST_STAT_IN_DEV';
        }
        function isInstanceInactive() {
            return MetricInstanceService.metricInstanceRequest.instanceStatus === 'KM_INST_STAT_NACTV';
        }
        function isInstancePendingReview() {
            return MetricInstanceService.metricInstanceRequest.instanceRequestStatus === 'KM_INST_REQ_PEND';
        }
        function canEditInstanceAsComplianceRiskAdmin() {
            var riskTypeCompliance = 1;
            return MetricInstanceService.metricBasePropertiesForDisplay().riskTypeIds.indexOf(String(riskTypeCompliance)) !== -1 && $rootScope.hasRole(['SYS_CMPLN_RSK_ADMIN']);
        }
        function canEditInstanceAsMetricInstanceOwner() {
            return $rootScope.getRolesForMetric(MetricInstanceService.metricInstanceRequest.metricInstanceId).indexOf('MTRC_INST_OWNR') !== -1;
        }
        function canEditInstanceAsMetricValueProvider() {
            return $rootScope.getRolesForMetric(MetricInstanceService.metricInstanceRequest.metricInstanceId).indexOf('MTRC_VAL_PRVD') !== -1;
        }
        function canEditInstanceAsOperationalRiskAdmin() {
            var riskTypeOperational = 4;
            return MetricInstanceService.metricBasePropertiesForDisplay().riskTypeIds.indexOf(String(riskTypeOperational)) !== -1 && $rootScope.hasRole(['SYS_OPRT_RSK_ADMIN']);
        }

        function isUserBlacklisted() {
            if (!isInstanceManualEntry()) {
                return true;
            }
            if (isInstanceInDevelopment()) {
                return true;
            }
            if (isInstanceInactive()) {
                if (!canEditInstanceAsComplianceRiskAdmin() && !canEditInstanceAsOperationalRiskAdmin()) {
                    return true;
                }
            }
            if (isInstancePendingReview()) {
                return true;
            }
            return false;
        }
        function isUserWhitelisted() {
            if (canEditInstanceAsMetricInstanceOwner()) {
                return true;
            }
            if (canEditInstanceAsMetricValueProvider()) {
                return true;
            }
            if (canEditInstanceAsComplianceRiskAdmin()) {
                return true;
            }
            if (canEditInstanceAsOperationalRiskAdmin()) {
                return true;
            }
            return false;
        }

        if (isUserBlacklisted()) {
            return true;
        }
        if (!isUserWhitelisted()) {
            return true;
        }
        return false;
    }

    function getGridOptions() {
        var gridOptions = angular.copy(MetricInstanceValuesConfig.valuesGrid);

        // Remove Numerator/Denominator columns from grid if not applicable
        if (MetricInstanceService.metricBasePropertiesForDisplay().inputType !== 'Numerator/Denominator') {
            gridOptions.columns = gridOptions.columns.filter(function (columnData) {
                return ['numeratorValueNumber', 'denominatorValueNumber'].indexOf(columnData.field) === -1;
            });
        }
        return gridOptions;
    }

    $scope.gridOptions = getGridOptions();
    $scope.gridDataSource = MetricValueService.getMetricInstanceDataSource(MetricInstanceService.metricInstanceId);
    $scope.gridReadOnly = isLocked();
});
