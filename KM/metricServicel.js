angular.module('keyMeasuresApp').factory('MetricValueService', function ($log, $http, $rootScope, OrcitLoader, KmConstants, DateTimeService) {
    'use strict';

    function deserializeMetricValuesForInstance(response) {
        return response.data.dataItem.map(function (valueData) {
            var attachmentExists = valueData.attachmentExists;
            var calculatedValue = valueData.calculatedValue;
            var commentText = valueData.commentText;
            var decimalPlaces = valueData.decimalPlaces;
            var denominatorValueNumber = valueData.denominatorValueNumber;
            var frequency = valueData.frequency;
            var frequencyLookupCode = valueData.frequencyLookupCode;
            var greenTriggerForDisplay = valueData.greenTriggerForDisplay;
            var goalDirection = valueData.goalDirection;
            var inputType = valueData.inputType;
            var limitThreshold = valueData.limitThreshold;
            var limitThresholdAttrib = valueData.limitThresholdAttrib;
            var lowerLimitThreshold = valueData.lowerLimitThreshold;
            var lowerLimitThresholdAttrib = valueData.lowerLimitThresholdAttrib;
            var lowerTriggerThreshold = valueData.lowerTriggerThreshold;
            var lowerTriggerThresholdAttrib = valueData.lowerTriggerThresholdAttrib;
            var metricBaseId = valueData.metricBaseId;
            var metricInstanceKey = valueData.metricInstanceKey;
            var metricInstanceId = valueData.metricInstanceKey;
            var metricValueDate = formatValueDate(valueData.metricValueDate, valueData.frequencyLookupCode);
            var metricValueId = valueData.metricValueId;
            var metricValueRequestId = valueData.metricValueRequestId;
            var ndtrFlag = valueData.ndtrFlag;
            var numeratorValueNumber = (inputType === KmConstants.metricValue.inputTypeNumeratorDenominator ? valueData.numeratorValueNumber : null);
            var pastDue = valueData.pastDue;
            var pastDueDisplay = valueData.pastDue ? 'Yes' : 'No';
            var rating = valueData.rating;
            var ratingOverrideFlag = valueData.ratingOverrideFlag;
            var redLimitForDisplay = valueData.redLimitForDisplay;
            var restatementReasonText = valueData.restatementReasonText;
            var reviewCommentText = valueData.reviewCommentText;
            var statusLookupCode = valueData.statusLookupCode;
            var thresholdExists = valueData.thresholdExists;
            var triggerThreshold = valueData.triggerThreshold;
            var triggerThresholdAttrib = valueData.triggerThresholdAttrib;
            var upperLimitThreshold = valueData.upperLimitThreshold;
            var upperLimitThresholdAttrib = valueData.upperLimitThresholdAttrib;
            var upperTriggerThreshold = valueData.upperTriggerThreshold;
            var upperTriggerThresholdAttrib = valueData.upperTriggerThresholdAttrib;
            var valueNumber = (inputType !== KmConstants.metricValue.inputTypeNumeratorDenominator && valueData.calculatedValue ? Number(valueData.calculatedValue.replace(/[^\d\.]/g, '')) : null);
            var valueType = valueData.valueType;
            var yellowNeeded = valueData.yellowNeeded;
            var yellowRangeForDisplay = valueData.yellowRangeForDisplay;

            return {
                attachmentExists: attachmentExists,
                calculatedValue: calculatedValue,
                commentText: commentText,
                decimalPlaces: decimalPlaces,
                denominatorValueNumber: denominatorValueNumber,
                frequency: frequency,
                frequencyLookupCode: frequencyLookupCode,
                greenTriggerForDisplay: greenTriggerForDisplay,
                goalDirection: goalDirection,
                inputType: inputType,
                limitThreshold: limitThreshold,
                limitThresholdAttrib: limitThresholdAttrib,
                lowerLimitThreshold: lowerLimitThreshold,
                lowerLimitThresholdAttrib: lowerLimitThresholdAttrib,
                lowerTriggerThreshold: lowerTriggerThreshold,
                lowerTriggerThresholdAttrib: lowerTriggerThresholdAttrib,
                metricBaseId: metricBaseId,
                metricInstanceId: metricInstanceId,
                metricInstanceKey: metricInstanceKey,
                metricValueDate: metricValueDate,
                metricValueId: metricValueId,
                metricValueRequestId: metricValueRequestId,
                ndtrFlag: ndtrFlag,
                numeratorValueNumber: numeratorValueNumber,
                pastDue: pastDue,
                pastDueDisplay: pastDueDisplay,
                rating: rating,
                ratingOverrideFlag: ratingOverrideFlag,
                redLimitForDisplay: redLimitForDisplay,
                restatementReasonText: restatementReasonText,
                reviewCommentText: reviewCommentText,
                statusLookupCode: statusLookupCode,
                thresholdExists: thresholdExists,
                triggerThreshold: triggerThreshold,
                triggerThresholdAttrib: triggerThresholdAttrib,
                upperLimitThreshold: upperLimitThreshold,
                upperLimitThresholdAttrib: upperLimitThresholdAttrib,
                upperTriggerThreshold: upperTriggerThreshold,
                upperTriggerThresholdAttrib: upperTriggerThresholdAttrib,
                valueNumber: valueNumber,
                valueType: valueType,
                yellowNeeded: yellowNeeded,
                yellowRangeForDisplay: yellowRangeForDisplay
            };
        });
    }

    function deserializeMetricValuesForCalculate(response) {
        return response.data.dataItem.map(function (valueData) {
            var calculatedValue = valueData.calculatedValue;
            var inputType = valueData.inputType;
            var metricInstanceKey = valueData.metricInstanceKey;
            var metricInstanceId = valueData.metricInstanceKey;
            var metricValueDate;
            if (valueData.frequencyLookupCode) {
                metricValueDate = formatValueDate(valueData.metricValueDate, valueData.frequencyLookupCode);
            } else {
                metricValueDate = valueData.metricValueDate;
            }
            var ndtrFlag = valueData.ndtrFlag;
            var numeratorValueNumber = (inputType === KmConstants.metricValue.inputTypeNumeratorDenominator ? valueData.numeratorValueNumber : null);
            var rating = valueData.rating;
            var valueNumber = (inputType !== KmConstants.metricValue.inputTypeNumeratorDenominator && valueData.calculatedValue ? Number(valueData.calculatedValue.replace(/[^\d\.]/g, '')) : null);
            var valueType = valueData.valueType;

            return {
                calculatedValue: calculatedValue,
                inputType: inputType,
                metricInstanceId: metricInstanceId,
                metricInstanceKey: metricInstanceKey,
                metricValueDate: metricValueDate,
                ndtrFlag: ndtrFlag,
                numeratorValueNumber: numeratorValueNumber,
                rating: rating,
                valueNumber: valueNumber,
                valueType: valueType,
            };
        });
    }

    function deserializeMetricValuesForQuickInput(response) {
        return {
            total: response.data.total,
            dataItem: response.data.dataItem.map(function (valueData) {
                var calculatedValue = valueData.calculatedValue;
                var commentText = valueData.commentText;
                var decimalPlaces = valueData.decimalPlaces;
                var denominatorValueNumber = valueData.denominatorValueNumber;
                var erh = valueData.erh;
                var frequency = valueData.frequency;
                var frequencyLookupCode = valueData.frequencyLookupCode;
                var geographicalRegion = valueData.geographicalRegion;
                var goalDirection = valueData.goalDirection;
                var inputType = valueData.inputType;
                var lastApprovedRating = valueData.lastApprovedRating;
                var lastApprovedValue = valueData.lastApprovedValue;
                var lastApprovedValueDate = valueData.lastApprovedValueDate;
                var legalEntities = valueData.legalEntities;
                var limitThreshold = valueData.limitThreshold;
                var limitThresholdAttrib = valueData.limitThresholdAttrib;
                var lowerLimitThreshold = valueData.lowerLimitThreshold;
                var lowerLimitThresholdAttrib = valueData.lowerLimitThresholdAttrib;
                var lowerTriggerThreshold = valueData.lowerTriggerThreshold;
                var lowerTriggerThresholdAttrib = valueData.lowerTriggerThresholdAttrib;
                var metricBaseId = valueData.metricBaseId;
                var metricBaseRequestId = valueData.metricBaseReqId;
                var metricInstanceId = valueData.metricInstanceKey;
                var metricInstanceKey = valueData.metricInstanceKey;
                var metricInstanceRequestId = valueData.metricInstanceReqKey;
                var metricName = valueData.metricName;
                var metricType = valueData.metricType;
                var metricValueDate = formatValueDate(valueData.metricValueDate, valueData.frequencyLookupCode);
                var metricValueId = valueData.metricValueId;
                var metricValueRequestId = valueData.metricValueRequestId;
                var ndtrFlag = valueData.ndtrFlag;
                var numeratorValueNumber = (inputType === KmConstants.metricValue.inputTypeNumeratorDenominator ? valueData.numeratorValueNumber : null);
                var rating = valueData.rating;
                var restatementReasonText = valueData.restatementReasonText;
                var reviewCommentText = valueData.reviewCommentText;
                var riskType = valueData.riskType;
                var thresholdExists = valueData.thresholdExists;
                var triggerThreshold = valueData.triggerThreshold;
                var triggerThresholdAttrib = valueData.triggerThresholdAttrib;
                var upperLimitThreshold = valueData.upperLimitThreshold;
                var upperLimitThresholdAttrib = valueData.upperLimitThresholdAttrib;
                var upperTriggerThreshold = valueData.upperTriggerThreshold;
                var upperTriggerThresholdAttrib = valueData.upperTriggerThresholdAttrib;
                var valueNumber = (inputType !== KmConstants.metricValue.inputTypeNumeratorDenominator && valueData.calculatedValue ? Number(valueData.calculatedValue.replace(/[^\d\.]/g, '')) : null);
                var valueType = valueData.valueType;
                var yellowNeeded = valueData.yellowNeeded;

                var metricValue = {
                    calculatedValue: calculatedValue,
                    commentText: commentText || null,
                    decimalPlaces: decimalPlaces,
                    denominatorValueNumber: denominatorValueNumber || null,
                    erh: erh,
                    frequency: frequency,
                    frequencyLookupCode: frequencyLookupCode,
                    geographicalRegion: geographicalRegion,
                    goalDirection: goalDirection,
                    inputType: inputType,
                    lastApprovedRating: lastApprovedRating,
                    lastApprovedValue: lastApprovedValue,
                    lastApprovedValueDate: lastApprovedValueDate,
                    legalEntities: legalEntities,
                    limitThreshold: limitThreshold,
                    limitThresholdAttrib: limitThresholdAttrib,
                    lowerLimitThreshold: lowerLimitThreshold,
                    lowerLimitThresholdAttrib: lowerLimitThresholdAttrib,
                    lowerTriggerThreshold: lowerTriggerThreshold,
                    lowerTriggerThresholdAttrib: lowerTriggerThresholdAttrib,
                    metricBaseId: metricBaseId,
                    metricBaseRequestId: metricBaseRequestId,
                    metricInstanceId: metricInstanceId,
                    metricInstanceKey: metricInstanceKey,
                    metricInstanceRequestId: metricInstanceRequestId,
                    metricName: metricName,
                    metricType: metricType,
                    metricValueDate: metricValueDate,
                    metricValueId: metricValueId,
                    metricValueRequestId: metricValueRequestId,
                    ndtrFlag: ndtrFlag || false,
                    numeratorValueNumber: numeratorValueNumber || null,
                    rating: rating,
                    restatementReasonText: restatementReasonText || null,
                    reviewCommentText: reviewCommentText,
                    riskType: riskType,
                    thresholdExists: thresholdExists,
                    triggerThreshold: triggerThreshold,
                    triggerThresholdAttrib: triggerThresholdAttrib,
                    upperLimitThreshold: upperLimitThreshold,
                    upperLimitThresholdAttrib: upperLimitThresholdAttrib,
                    upperTriggerThreshold: upperTriggerThreshold,
                    upperTriggerThresholdAttrib: upperTriggerThresholdAttrib,
                    valueNumber: valueNumber || null,
                    valueType: valueType,
                    yellowNeeded: yellowNeeded
                };
                return metricValue;
            })
        };
    }

    function formatValueDate(inputDateString, frequencyLookupCode) {
        var normalizedDate = DateTimeService.normalizeDate(inputDateString);
        var dateMoment = moment(normalizedDate, 'MM/DD/YYYY');
        var formattedDate;

        switch (frequencyLookupCode) {
            case KmConstants.metricInstance.frequencyDaily.value:
            case KmConstants.metricInstance.frequencyWeekly.value:
                formattedDate = dateMoment.format('MM/DD/YYYY');
                break;
            case KmConstants.metricInstance.frequencyMonthly.value:
                formattedDate = dateMoment.format('MMMM YYYY');
                break;
            case KmConstants.metricInstance.frequencyQuarterly.value:
                formattedDate = 'Quarter ' + dateMoment.format('Q YYYY');
                break;
            case KmConstants.metricInstance.frequencySemiAnnually.value:
                formattedDate = 'Half ' + Math.ceil(dateMoment.quarter() / 2) + ' ' + dateMoment.format('YYYY');
                break;
            case KmConstants.metricInstance.frequencyAnnually.value:
                formattedDate = dateMoment.format('YYYY');
                break;
            default:
                throw new Error('Invalid frequency: ' + JSON.stringify(frequencyLookupCode));
        }

        return formattedDate;
    }

    function serializeMetricValues(metricValues) {
        return metricValues.map(function (metricValue) {
            var commentText = metricValue.commentText;
            var denominatorValueNumber = metricValue.denominatorValueNumber;
            var inputType = metricValue.inputType;
            var metricInstanceKey = metricValue.metricInstanceId;
            var metricValueDate = DateTimeService.normalizeDate(metricValue.metricValueDate);
            var ndtrFlag = metricValue.ndtrFlag === 'Y' ? 'Y' : 'N';
            var numeratorValueNumber = (inputType === KmConstants.metricValue.inputTypeNumeratorDenominator ? metricValue.numeratorValueNumber : metricValue.valueNumber);
            var restatementReasonText = metricValue.restatementReasonText;
            var valueType = metricValue.valueType;

            return {
                commentText: commentText,
                denominatorValueNumber: denominatorValueNumber,
                inputType: inputType,
                metricInstanceKey: metricInstanceKey,
                metricValueDate: metricValueDate,
                ndtrFlag: ndtrFlag,
                numeratorValueNumber: numeratorValueNumber,
                restatementReasonText: restatementReasonText,
                valueType: valueType
            };
        });
    }

    return {
        getDeleteMetricInstanceValueAttachment: function (metricValueId, metricValueRequestId) {
            // @todo use POST request
            return $http.get('app/values/attachment/remove', {
                params: {
                    metricValueId: metricValueId,
                    metricValueRequestId: metricValueRequestId
                }
            });
        },
        getMetricInstanceDataSource: function (metricInstanceId) {
            function getData() {
                return $http.get('app/values/all', {
                    params: {
                        metricInstanceId: metricInstanceId
                    }
                })
                .then(deserializeMetricValuesForInstance);
            }

            return new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        OrcitLoader.load(getData())
                        .then(function (data) {
                            options.success(data);
                        });
                    }
                },
                pageSize: 10,
                serverPaging: false,
                serverSorting: false,
                serverFiltering: false,
                error: function (err) {
                    this.cancelChanges();
                    $rootScope.showError('Error', err.xhr.data.message);
                },
                schema: {
                    data: function (data) {
                        return data;
                    },
                    total: function (data) {
                        return data.length;
                    },
                    model: {
                        fields: {
                            metricInstanceId: {
                                type: 'number'
                            },
                            metricBaseId: {
                                type: 'number'
                            }
                        }
                    }
                }
            });
        },
        getMetricInstanceValueAttachment: function (metricValueRequestId) {
            return $http.get('app/values/attachment/', {
                params: {
                    metricValueRequestId: metricValueRequestId
                }
            })
            .then(function (response) {
                return response.data;
            });
        },
        getMetricInstanceValueHistory: function (metricValueId) {
            return $http.get('app/values/history', {
                params: {
                    metricValueId: metricValueId
                }
            })
            .then(function (response) {
                return response.data.dataItem;
            });
        },
        getQuickInputDataSource: function () {
            function getData(options) {
                var sort;
                if (options.data.sort && options.data.sort[0]) {
                    sort = {
                        dir: options.data.sort[0].dir,
                        field: options.data.sort[0].field
                    };
                } else {
                    sort = {
                        dir: null,
                        field: null
                    };
                }
                return $http.post('app/values/quickInput', {
                    pageSize: options.data.pageSize,
                    page: options.data.page,
                    skip: options.data.skip,
                    take: options.data.take,
                    sortDir: sort.dir,
                    sortField: sort.field,
                    filters: options.data.filter ? options.data.filter.filters : options.data.filter
                })
                .then(deserializeMetricValuesForQuickInput);
            }

            return new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        OrcitLoader.load(getData(options))
                        .then(function (data) {
                            options.success(data);
                        });
                    }
                },
                pageSize: 10,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                error: function (err) {
                    this.cancelChanges();
                    $rootScope.showError('Error', err.xhr.data.message);
                },
                schema: {
                    data: function (data) {
                        return data.dataItem;
                    },
                    total: function (data) {
                        return data.total;
                    },
                    model: {
                        fields: {
                            metricInstanceId: {
                                type: 'string'
                            },
                            metricBaseId: {
                                type: 'string'
                            }
                        }
                    }
                }
            });
        },
        postCalculateMetricInstanceValues: function (metricValues) {
            return $http.post('app/values/calculate/qi', serializeMetricValues(metricValues))
            .then(deserializeMetricValuesForCalculate);
        },
        postSaveMetricValues: function (valuesData, gridType) {
            var promise;
            switch (gridType) {
                case 'metricInstance':
                    promise = $http.post('app/values/metricValues/save', serializeMetricValues(valuesData))
                    .then(function (response) {
                        return response.data;
                    });
                    break;
                case 'quickInput':
                    promise = $http.post('app/values/save/qi', serializeMetricValues(valuesData))
                    .then(function (response) {
                        return response.data;
                    });
                    break;
                default:
                    throw new Error('Invalid grid type: ' + JSON.stringify(gridType));
            }
            return promise;
        },
        validateMetricValue: function (metricValue) {
            function isValueChanged() {
                if (metricValue.fieldsChanged.indexOf('denominatorValueNumber') !== -1) {
                    return true;
                }
                if (metricValue.fieldsChanged.indexOf('ndtrFlag') !== -1) {
                    return true;
                }
                if (metricValue.fieldsChanged.indexOf('numeratorValueNumber') !== -1) {
                    return true;
                }
                if (metricValue.fieldsChanged.indexOf('valueNumber') !== -1) {
                    return true;
                }
                return false;
            }
            function validateRestatementReason() {
                var messages = [];
                if (!metricValue.restatementReasonText) {
                    if (metricValue.fieldsChanged.indexOf('restatementReasonText') !== -1) {
                        messages.push('Restatement Reason cannot be deleted');
                    } else if (isValueChanged() && metricValue.statusLookupCode === KmConstants.metricValue.statusApproved) {
                        messages.push('Restatement Reason is required');
                    }
                } else if (!isValueChanged() && metricValue.fieldsChanged.indexOf('restatementReasonText') !== -1) {
                    messages.push('Restatement Reason cannot be changed without changing value');
                }
                return messages;
            }
            function validateNumeratorValue() {
                var messages = [];
                if (typeof metricValue.numeratorValueNumber === 'number') {
                    if (isNaN(metricValue.numeratorValueNumber)) {
                        messages.push('Numerator value is not a valid number');
                    } else if (metricValue.numeratorValueNumber < 0) {
                        messages.push('Numerator value must not be a negative number');
                    }
                } else if (typeof metricValue.denominatorValueNumber === 'number') {
                    messages.push('Numerator value is required if Denominator value is present');
                } else if (!metricValue.numeratorValueNumber && metricValue.statusLookupCode !== KmConstants.metricValue.statusApproved) {
                    messages.push('Numerator value is required');
                }
                return messages;
            }
            function validateDenominatorValue() {
                var messages = [];
                if (typeof metricValue.denominatorValueNumber === 'number') {
                    if (isNaN(metricValue.denominatorValueNumber)) {
                        messages.push('Denominator value is not a valid number');
                    } else if (metricValue.denominatorValueNumber === 0) {
                        messages.push('Denominator value must not be zero');
                    } else if (metricValue.denominatorValueNumber < 0) {
                        messages.push('Denominator value must not be a negative number');
                    }
                } else if (typeof metricValue.numeratorValueNumber === 'number') {
                    messages.push('Denominator value is required if Numerator value is present');
                } else if (!metricValue.denominatorValueNumber && metricValue.statusLookupCode !== KmConstants.metricValue.statusApproved) {
                    messages.push('Denominator value is required');
                }
                return messages;
            }
            function validateValue() {
                var messages = [];
                if (typeof metricValue.valueNumber === 'number') {
                    if (isNaN(metricValue.valueNumber)) {
                        messages.push('Value is not a valid number');
                    } else if (metricValue.valueNumber < 0) {
                        messages.push('Value must not be a negative number');
                    }
                } else if (!metricValue.valueNumber && metricValue.statusLookupCode !== KmConstants.metricValue.statusApproved) {
                    messages.push('Value is required');
                }
                return messages;
            }

            // Configure validation
            var validators = [];

            validators.push(validateRestatementReason);

            if (isValueChanged() || !metricValue.statusLookupCode) {
                if (metricValue.ndtrFlag !== 'Y') {
                    if (metricValue.inputType === KmConstants.metricValue.inputTypeNumeratorDenominator) {
                        validators.push(validateNumeratorValue);
                        validators.push(validateDenominatorValue);
                    } else {
                        validators.push(validateValue);
                    }
                }
            }

            // Perform validation
            var validationErrors = [];
            validators.forEach(function(validator) {
                validationErrors = validationErrors.concat(validator());
            });
            validationErrors = validationErrors.map(function (validationError) {
                return 'Metric Instance ID ' + metricValue.metricInstanceId + ' - Period ' + metricValue.metricValueDate + ': ' + validationError;
            });
            return validationErrors;
        }
    };
});
