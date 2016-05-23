angular.module('keyMeasuresApp').value('MetricSearchGridConfig', {
    metricBaseGridOptions: {
        pageable: {
            pageSizes: [10, 25, 50, 100]
        },
        resizable: true,
        detailTemplate: '<km-metric-search-grid-instances o-data-item="dataItem" o-metric-search-input="metricSearchInput"></km-metric-search-grid-instances>',
        columns: [{
            field: 'metricBaseId',
            title: 'Base ID',
            template: '<a ui-sref="app.metricbase-update({metricBaseId: this.dataItem.metricBaseId, metricBaseReqId: this.dataItem.metricBaseReqId})">{{this.dataItem.metricBaseId}}</a>'
        }, {
            field: 'metricBaseReqId',
            hidden: true
        }, {
            field: 'metricBaseName',
            title: 'Name'
        }, {
            field: 'metricBaseDefinition',
            title: 'Definition'
        }, {
            field: 'created',
            title: 'Created',
            template: '<div ng-if="this.dataItem.created">{{this.dataItem.created | date: \'MM/dd/yyyy\'}}</div><div ng-if="!this.dataItem.created"></div>'
        }, {
            field: 'numberOfInstances',
            title: 'Total Instances'
        }]
    },

    searchPageInstancesGridConfig: {
        pageable: true,
        resizable: true,
        filterable: true,
        scrollable: true,
        columns: [{
            field: 'metricInstanceId',
            title: 'ID',
            width: '80px',
            template: '<a ui-sref="app.metricinstance-update({metricBaseId: this.dataItem.metricBaseId, metricBaseReqId: this.dataItem.metricBaseRequestId, metricInstanceId: this.dataItem.metricInstanceId, metricInstanceReqId: this.dataItem.metricInstanceRequestId})">{{this.dataItem.metricInstanceId}}</a>',
            filterable: false
        }, {
            field: 'metricType',
            title: 'Metric Type',
            width: '130px',
            template: '<div>{{this.dataItem.metricType.join(\';\')}}</div>',
            filterable: false
        }, {
            field: 'hierarchy',
            title: 'Hierarchy',
            width: '200px',
            template: '<div>{{this.dataItem.hierarchy.join(\';\')}}</div>',
            filterable: false
        }, {
            field: 'region',
            title: 'Region',
            width: '125px',
            filterable: {
                multi: true
            }
        }, {
            field: 'legalEntity',
            title: 'Legal Entity',
            width: '200px',
            template: '<div>{{this.dataItem.legalEntity.join(\';\')}}</div>',
            filterable: false
        }, {
            field: 'createdTime',
            title: 'Created',
            width: '150px',
            filterable: {
                multi: true
            }
        }, {
            field: 'instanceStatus',
            title: 'Status',
            width: '100px',
            filterable: {
                multi: true
            }
        }]
    },

    internalOutsourcedOptions: {
        placeholder: 'Select Internal/Outsourced...',
        dataTextField: 'name',
        dataValueField: 'value',
        valuePrimitive: true,
        autoBind: false
    },

    operationalMetricTypeOptions: {
        placeholder: 'Select Operational Metric Type...',
        dataTextField: 'lookupText',
        dataValueField: 'optionLookupId',
        valuePrimitive: true,
        autoBind: false
    },

    complianceMetricTypeOptions: {
        placeholder: 'Select Compliance Metric Type...',
        dataTextField: 'lookupText',
        dataValueField: 'optionLookupId',
        valuePrimitive: true,
        autoBind: false
    },

    enterpriseAreaOfCoverageOptions: {
        placeholder: 'Select Enterprise Area of Coverage...',
        dataTextField: 'areaOfCoverageName',
        dataValueField: 'id',
        valuePrimitive: true,
        autoBind: false
    }
});
