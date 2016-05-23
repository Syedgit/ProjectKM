angular.module('keyMeasuresApp').controller('MetricValueFileUploadCtrl', function ($log, $scope, $rootScope, $window, OrcitLoader, KmGrowl, KmModal, MetricValueFileUploadConfig, MetricValueFileUploadService) {
    'use strict';

    $log.info('Metric Value File Upload Controller initialized');

    $scope.fileUploadOptions = MetricValueFileUploadConfig.fileUploadConfig;
    $scope.uploadGridOptions = MetricValueFileUploadConfig.uploadsGridConfig;
    $scope.showUploadStatusGrid = false;
    $scope.showAllRecords = 'N';

    function loadHistory() {
        OrcitLoader.load(MetricValueFileUploadService.getAllUploads($scope.showAllRecords))
        .then(function (uploadData) {
            if (uploadData.data.dataItem.length > 0) {
                $scope.showUploadStatusGrid = true;
            } else {
                $scope.showUploadStatusGrid = false;
            }

            var fileUploads = uploadData.data.dataItem;

            var dataSource = new kendo.data.DataSource({
                data: fileUploads,
                pageSize: 10
            });
            dataSource.filter({
                logic: 'and',
                filters: [
                    {
                        field: 'uploadedBy',
                        operator: 'eq',
                        value: $rootScope.user.fullName
                    }
                ]
            });
            $scope.uploadsGrid.setDataSource(dataSource);
        });
    }

    $scope.addMorePostParameters = function (event) {
        event.data = {
            fileName: $scope.filename,
            wrkStreamProcess: 'KeyMeasuresBatchUpload',
            wrkStream: 'KeyMeasures',
            uid: $rootScope.user.principal
        };
    };

    $scope.downloadUserGuide = function () {
        $rootScope.showInfo('Not Available', 'User Guide coming soon.');
    };

    $scope.onClickDeleteFile = function (dataItem) {
        KmModal.confirm({
            title: 'Delete Confirmation',
            message: 'Are you sure you want to delete this file? This action cannot be undone.',
            type: 'danger',
            ok: 'Yes',
            cancel: 'No'
        })
        .then(function () {
            return OrcitLoader.load(MetricValueFileUploadService.deleteFile(dataItem.id));
        })
        .then(function () {
            KmGrowl.success('Attachment Successfully Deleted');
            loadHistory();
        });
    };

    $scope.processFile = function (id) {
        OrcitLoader.load(MetricValueFileUploadService.processFile(id))
        .then(function (response) {
            if (response.data.success) {
                KmGrowl.success('File processed successfully');
                loadHistory();
            }
        });
    };

    $scope.downloadFile = function (attachmentReqId) {
        $window.open('app/metricValue/bulkupload/download/' + attachmentReqId);
    };
    $scope.downloadTemplate = function () {
        $window.open('app/metricValue/bulkupload/downloadTemplate/' + $rootScope.user.principal);
    };

    $scope.$watch('showAllRecords', function () {
        loadHistory();
    });

    $scope.onSuccess = function (data) {
        $scope.filename = '';

        $log.debug('Response data', JSON.stringify(data.response));
        var response = data.response;
        var messages = [];
        if (!response.success) {
            // Gather messages
            if (response.item && response.item.message) {
                messages.push(response.item.message);
            }
            if (response.message) {
                messages.push(response.message);
            }

            // Show status to user
            $rootScope.showError('Error Uploading File', messages.join(', '));
        } else {
            // Gather messages
            if (response.item) {
                if (response.item.message) {
                    messages.push(response.item.message);
                }
                if (response.item.uploadStatus) {
                    messages.push(response.item.uploadStatus);
                }
            }

            // Show status to user
            KmGrowl.success('File Uploaded Successfully: ' + messages.join(', '));
            loadHistory();
        }

        $scope.$apply();
    };

    $scope.onError = function (e) {
        $scope.filename = '';

        if (e.XMLHttpRequest.response) {
            var response = angular.fromJson(e.XMLHttpRequest.response);
            $rootScope.showError('Error', response.message);
        } else {
            $rootScope.showError('Error', 'An error occurred while uploading the file.');
        }

        $scope.$apply();
    };
});
