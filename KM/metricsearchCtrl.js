angular.module('keyMeasuresApp').controller('MetricSearchController', function ($log, $scope, $rootScope, OrcitLoader, KmConstants, ReferenceDataService, ReferenceDataConfig, MetricSearchService, MetricSearchGridConfig, MetricInstanceService) {
    'use strict';

    $log.info('Metric Search Controller initialized');

    $scope.searchResult = {};
    $scope.metricBaseMainGridOptions = MetricSearchGridConfig.metricBaseGridOptions;

    $scope.temporary = {
        metricInstanceIds: null,
        internalOutsourcedOptions: null, // populated asynchronously below
        instanceFrequencyOptions: null, // populated asynchronously below
        instanceStatusOptions: null, // populated asynchronously below
        operationalMetricTypeOptions: null, // populated asynchronously below
        complianceMetricTypeOptions: null, // populated asynchronously below
        erhTreeOptions: null, // populated asynchronously below
        geoTreeOptions: null, // populated asynchronously below
        geoLocations: [],
        erh: [],
        baseWorker: null,
        instanceWorker: null,
        legalEntity: null
    };

    ReferenceDataService.getInternalOutsource()
        .then(function (internalOutsourcedOptions) {
            $scope.temporary.internalOutsourcedOptions = internalOutsourcedOptions;
        });
    ReferenceDataService.getMetricInstanceFrequencyOptions()
        .then(function (instanceFrequencyOptions) {
            $scope.temporary.instanceFrequencyOptions = instanceFrequencyOptions;
        });
    ReferenceDataService.getMetricInstanceStatusesOptions()
        .then(function (instanceStatusOptions) {
            $scope.temporary.instanceStatusOptions = instanceStatusOptions;
        });
    ReferenceDataService.getActiveMetricTypeForCategoryName(KmConstants.metricBase.riskTypeCompliance.name)
        .then(function (complianceMetricTypeOptions) {
            $scope.temporary.complianceMetricTypeOptions = complianceMetricTypeOptions;
        });
    ReferenceDataService.getActiveMetricTypeForCategoryName(KmConstants.metricBase.riskTypeOperational.name)
        .then(function (operationalMetricTypeOptions) {
            $scope.temporary.operationalMetricTypeOptions = operationalMetricTypeOptions;
        });
    ReferenceDataService.getERH()
        .then(function (erhTreeviewData) {
            $scope.temporary.erhTreeOptions = erhTreeviewData;
        });
    ReferenceDataService.getGeoLocations()
        .then(function (geographyTreeviewData) {
            $scope.temporary.geoTreeOptions = geographyTreeviewData;
        });

    $scope.metricSearchInput = {
        keyword: '',
        status: '',
        ids: '',
        dataSource: '',
        riskTypeIds: [],
        operationalRiskCategoryIds: [],
        privilegedMetricFlag: 'N',
        standardId: '',
        instanceIds: [],
        instanceFrequency: null,
        iodescription: null,
        rcsaReportableFlag: null,
        instanceStatus: null,
        internalOutsourced: [],
        complianceMetricType: [],
        operationalMetricType: [],
        enterpriseAreaOfCoverage: [],
        legalEntity: null,
        geoLocation: null,
        instanceStandardId: null,
        reportingHierarchies: [],
        baseIds : ''
    };

    var resetSearchResultGrid = function () {
        return new kendo.data.DataSource({
            data: $scope.searchResultData,
            pageSize: 10
        });
    };

    $scope.status = {
        isMetricBaseOpen: true,
        isMetricInstanceOpen: false
    };

    var updateSearchResults = function (searchMetricBase) {
        OrcitLoader.load(MetricSearchService.search(searchMetricBase))
            .then(function (result) {
                $scope.status.isMetricBaseOpen = false;
                $scope.status.isMetricInstanceOpen = false;
                if (result.data.dataItem.length > 0) {
                    $scope.showSearchResultGrid = true;
                }
                else {
                    $rootScope.showWarning('Search Results ', ' No data found');
                }

                $scope.searchResultData = result.data.dataItem;
                $scope.searchResult.total = result.data.total;
                $scope.metricBaseDataGrid.setDataSource(resetSearchResultGrid());
            });
    };

    $scope.search = function () {
        if ($scope.temporary.metricInstanceIds) {
            $scope.metricSearchInput.instanceIds = $scope.temporary.metricInstanceIds.split(',');
        }
        if (isBaseSearched() || MetricInstanceService.isInstanceSearched($scope.metricSearchInput)) {
            updateSearchResults($scope.metricSearchInput);
        } else {
            $rootScope.showWarning('Metric Search Input Required', ' Please provide at least one search input ');
        }
    };

    var isBaseSearched = function () {
        if ($scope.metricSearchInput.riskTypeIds.length > 0 || $scope.metricSearchInput.operationalRiskCategoryIds.length > 0 || $scope.metricSearchInput.keyword || $scope.metricSearchInput.ids || $scope.metricSearchInput.dataSource || $scope.metricSearchInput.status || $scope.metricSearchInput.privilegedMetricFlag === 'Y' || $scope.metricSearchInput.standardId) {
            return true;
        }
        return false;
    };

    $scope.internalOutsourcedOptions = angular.copy(MetricSearchGridConfig.internalOutsourcedOptions);
    $scope.internalOutsourcedOptions.dataSource = ReferenceDataService.getInternalOutsourceDataSource();

    $scope.operationalMetricTypeOptions = angular.copy(MetricSearchGridConfig.operationalMetricTypeOptions);
    $scope.operationalMetricTypeOptions.dataSource = ReferenceDataService.getActiveMetricTypeForCategoryNameDataSource('Operational');

    $scope.complianceMetricTypeOptions = angular.copy(MetricSearchGridConfig.complianceMetricTypeOptions);
    $scope.complianceMetricTypeOptions.dataSource = ReferenceDataService.getActiveMetricTypeForCategoryNameDataSource('Compliance');

    $scope.enterpriseAreaOfCoverageOptions = MetricSearchGridConfig.enterpriseAreaOfCoverageOptions;
    $scope.enterpriseAreaOfCoverageDataSource = ReferenceDataService.getEnterpriseAreaOfCoverageDataSource();

    var resetCheckboxControls = function () {
        $log.info(' resetting all the risk selections ');
        var riskTypeArr = $scope.riskTypes;
        for (var i = 0; i < riskTypeArr.length; i++) {
            riskTypeArr[i].checkedCatVal = false;
        }

        var opRiskCatArr = $scope.operationRiskCategories;
        for (i = 0; i < opRiskCatArr.length; i++) {
            opRiskCatArr[i].checkedOpRiskCat = false;
        }
    };

    $scope.handleRiskSelection = function (riskType) {
        var elementIndex;

        if (riskType.checkedCatVal) {
            $log.info(' Pushing RiskType :: ' + riskType.categoryName);
            $scope.metricSearchInput.riskTypeIds.push(riskType.id);
        } else {
            $log.info(' Removing RiskType :: ' + riskType.categoryName);
            elementIndex = $scope.metricSearchInput.riskTypeIds.indexOf(riskType.id);
            $scope.metricSearchInput.riskTypeIds.splice(elementIndex, 1);
        }
    };

    $scope.handleOpRiskCatSelection = function (operationRiskCategory) {
        var elementIndex;

        if (operationRiskCategory.checkedOpRiskCat) {
            $log.info(' Pushing OpRiskCat :: ' + operationRiskCategory.categoryName);
            $scope.metricSearchInput.operationalRiskCategoryIds.push(operationRiskCategory.id);
        } else {
            $log.info(' Removing OpRiskCat :: ' + operationRiskCategory.categoryName);
            elementIndex = $scope.metricSearchInput.riskTypeIds.indexOf(operationRiskCategory.id);
            $scope.metricSearchInput.operationalRiskCategoryIds.splice(elementIndex, 1);
        }
    };

    var searchFormCopy = angular.copy($scope.metricSearchInput);

    $scope.resetForm = function () {
        $log.info(' setting it to pristine state ');
        $scope.status = {
            isMetricBaseOpen: true,
            isMetricInstanceOpen: false
        };
        $scope.metricSearchInput = angular.copy(searchFormCopy);
        $scope.temporary.metricInstanceIds = null;
        $scope.metricSearchInput.instanceIds = null;
        $scope.temporary.erh = [];
        $scope.temporary.geoLocations = [];
        $scope.temporary.baseWorker = null;
        $scope.temporary.instanceWorker = null;
        $scope.temporary.legalEntity = null;
        resetCheckboxControls();
        $scope.searchResultData = [];
        $scope.metricBaseDataGrid.setDataSource(resetSearchResultGrid());
        $scope.showSearchResultGrid = false;
    };

    ReferenceDataService.getStatusTypes().then(function (statusTypes) {
        $scope.statusTypes = statusTypes.data;
    });

    $scope.getDatasourceList = function (val) {
        return ReferenceDataService.getApplicationInventoryListForMB(val).then(function (response) {
            return response.data;
        });
    };

    ReferenceDataService.getOpRiskCategories().then(function (opRiskCategories) {
        $log.info('Got Operation Risk Categories:', opRiskCategories);
        $scope.operationRiskCategories = opRiskCategories.data;
    });

    ReferenceDataService.getRiskTypes().then(function (riskTypes) {
        $log.info('Got riskTypes:', riskTypes);
        $scope.riskTypes = riskTypes.data;
    });

    // Field: Base/Instance User Name
    $scope.getWorkerList = function (partialName) {
        return ReferenceDataService.getWorkerDetailsTypeahead(partialName);
    };
    $scope.$watch('temporary.baseWorker', function () {
        if ($scope.temporary.baseWorker) {
            $scope.metricSearchInput.standardId = $scope.temporary.baseWorker.stdId;
        } else {
            $scope.metricSearchInput.standardId = null;
        }
    });
    $scope.removeBaseWorker = function () {
        $scope.temporary.baseWorker = null;
    };
    $scope.$watch('temporary.instanceWorker', function () {
        if ($scope.temporary.instanceWorker) {
            $scope.metricSearchInput.instanceStandardId = $scope.temporary.instanceWorker.stdId;
        } else {
            $scope.metricSearchInput.instanceStandardId = null;
        }
    });
    $scope.removeInstanceWorker = function () {
        $scope.temporary.instanceWorker = null;
    };

    // Field: Legal Entity
    $scope.getLegalEntityList = function (partialName) {
        return ReferenceDataService.getLegalEntityListTypeahead(partialName);
    };
    $scope.$watch('temporary.legalEntity', function () {
        if ($scope.temporary.legalEntity) {
            $scope.metricSearchInput.legalEntity = $scope.temporary.legalEntity.id;
        } else {
            $scope.metricSearchInput.legalEntity = null;
        }
    });
    $scope.removeLegalEntity = function () {
        $scope.temporary.legalEntity = null;
    };

    // Field: Geography
    $scope.$watchCollection('temporary.geoLocations', function () {
        if ($scope.temporary.geoLocations.length) {
            $scope.metricSearchInput.geoLocation = $scope.temporary.geoLocations[0].geoLocateKey;
        } else {
            $scope.metricSearchInput.geoLocation = null;
        }
    });

    // Field: Reporting Hierarchy
    $scope.$watchCollection('temporary.erh', function () {
        $scope.metricSearchInput.reportingHierarchies = $scope.temporary.erh.map(function (reportingHierarchy) {
            return reportingHierarchy.id;
        });
    });

    $scope.selectDataSource = function ($item) {
        $scope.metricSearchInput.dataSource = $item.name;
        $scope.metricSearchInput.baseIds = $item.value;
    };
});
