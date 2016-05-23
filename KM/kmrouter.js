angular.module('keyMeasuresApp').config(function ($httpProvider, $provide, $stateProvider, $tooltipProvider, $urlRouterProvider) {
    'use strict';

    // This has to be here because the browsers will not catch the home state without it.
    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        $state.go('app.home');
    });

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.get = {
        'If-Modified-Since': '0'
    };
    $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/json',
        'Pragma': 'no-cache'
    };
    $httpProvider.interceptors.push('KmHttpInterceptor');
    $httpProvider.interceptors.push('ssoInterceptor');

    $tooltipProvider.options({
        appendToBody: true
    });

    // UI Bootstrap: hide deprecation warnings for uib-dropdown
    $provide.provider('$dropdownSuppressWarning', function () {
        this.$get = function () {
            return true;
        };
    });

    // orcit-breadcrumbs: hide deprecation warnings
    $provide.provider('orcitBreadcrumbsSuppressWarning', function () {
        this.$get = function () {
            return true;
        };
    });

    $stateProvider
        .state('app', {
            abstract: true,
            url: '',
            templateUrl: 'views/partials/common/main.html',
            controller: 'MainCtrl',
            resolve: {
                serverTimeZone: function (DateTimeService) {
                    return DateTimeService.loadServerTimeZone();
                }
            }
        })

        // Auth
        .state('app.login', {
            url: '/login',
            templateUrl: 'views/partials/security/login.html',
            controller: 'LoginController'
        })
        .state('app.smlogin', {
            url: '/smlogin',
            controller: 'SMLoginController'
        })
        .state('app.logout', {
            url: '/logout',
            controller: 'LogoutController'
        })
        .state('app.unauthorized', {
            url: '/unauthorized',
            templateUrl: 'views/partials/security/403.html',
        })
        .state('app.unavailable', {
            url: '/unavailable',
            templateUrl: 'views/partials/security/404.html',
        })

        // Home
        .state('app.home', {
            url: '/',
            templateUrl: 'views/partials/home/home.html',
            controller: 'HomeController',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Home',
                path: ['app.home']
            },
            resolve: {
                announcements: function (HomeService) {
                    return HomeService.getAnnouncements();
                },
                home: function (HomeService) {
                    return HomeService.getHome();
                }
            }
        })

        // Email Notifications
        .state('app.notification', {
            url: '/notificationsTemplate',
            controller: 'NotificationsController',
            templateUrl: 'views/partials/admin/notifications.html',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Email Notifications - Notifications Template',
                path: ['app.home', 'app.notification']
            }
        })

        // Application Properties
        .state('app.properties', {
            url: '/applicationProperties',
            controller: 'ApplicationPropertiesController',
            templateUrl: 'views/partials/admin/application-properties.html',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Application Properties',
                path: ['app.home', 'app.properties']
            }
        })

        // Metric Search
        .state('app.metric-search', {
            url: '/metrics',
            templateUrl: 'views/partials/metricsearch/metric-search.html',
            controller: 'MetricSearchController',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Metric Search',
                path: ['app.home', 'app.metric-search']
            }
        })

        // Metric Base
        .state('app.metricbase-new', {
            url: '/metrics/base',
            templateUrl: 'views/partials/metricbase/metricbase.html',
            controller: 'MetricBaseController',
            data: {
                authenticate: true,
            },
            resolve: {
                MetricBaseProperties: function () {
                    return null;
                }
            },
            breadcrumb: {
                title: 'Metric Base - New',
                path: ['app.home', 'app.metricbase-new']
            }
        })
        .state('app.metricbase-update', {
            url: '/metrics/base/:metricBaseId/:metricBaseReqId',
            templateUrl: 'views/partials/metricbase/metricbase.html',
            controller: 'MetricBaseController',
            data: {
                authenticate: true
            },
            resolve: {
                MetricBaseProperties: function (MetricBaseService, $stateParams) {
                    return MetricBaseService.getMetricBase($stateParams.metricBaseReqId);
                }
            },
            breadcrumb: {
                title: 'Metric Base - :metricBaseId',
                path: ['app.home', 'app.metricbase-update']
            }
        })
        .state('app.metricBaseMassUpdate', {
            abstract: true,
            url: '/metrics/massUpdate/base',
            templateUrl: 'views/partials/metricbase/metricbase-massupdate.html'
        })
        .state('app.metricBaseMassUpdate.search', {
            url: '/search',
            controller: 'MetricBaseMassUpdateListCtrl',
            templateUrl: 'views/partials/metricbase/metricbase-massupdate-listbases.html',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Metric Base Mass Update - Mass Update',
                path: ['app.home', 'app.metricBaseMassUpdate.search']
            }
        })
        .state('app.metricBaseMassUpdate.history', {
            url: '/history',
            templateUrl: 'views/partials/metricbase/metricbase-massupdate-history.html',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Metric Base Mass Update - Processing History',
                path: ['app.home', 'app.metricBaseMassUpdate.history']
            }
        })

        // Metric Instance
        .state('app.metricinstance-new', {
            url: '/metrics/base/:metricBaseId/:metricBaseReqId/instance',
            templateUrl: 'views/partials/metricinstance/metricinstance.html',
            controller: 'MetricInstanceCtrl',
            resolve: {
                MetricBaseProperties: function (MetricInstanceService, $stateParams) {
                    return MetricInstanceService.metricBaseProperties($stateParams.metricBaseId);
                },
                metricInstanceSecurity: function (MetricInstanceService, $stateParams) {
                    return MetricInstanceService.getMetricInstanceSecurity($stateParams.metricBaseId);
                },
                panelHeader: function () {
                    return 'Create Metric Instance';
                }
            },
            data: {
                authenticate: true,
            },
            breadcrumb: {
                title: 'Metric Instance - New',
                path: ['app.home', 'app.metricbase-update', 'app.metricinstance-new']
            }
        })
        .state('app.metricinstance-update', {
            url: '/metrics/base/:metricBaseId/:metricBaseReqId/instance/:metricInstanceId/:metricInstanceReqId',
            templateUrl: 'views/partials/metricinstance/metricinstance.html',
            controller: 'MetricInstanceUpdateCtrl',
            resolve: {
                MetricInstanceRequest: function (MetricInstanceService, $stateParams) {
                    return MetricInstanceService.getMetricInstanceRequestFromId($stateParams.metricInstanceReqId);
                },
                MetricBaseProperties: function (MetricInstanceService, $stateParams) {
                    return MetricInstanceService.metricBaseProperties($stateParams.metricBaseId);
                },
                metricInstanceSecurity: function (MetricInstanceService, $stateParams) {
                    return MetricInstanceService.getMetricInstanceSecurity($stateParams.metricBaseId, $stateParams.metricInstanceReqId);
                },
                panelHeader: function () {
                    return 'Update Metric Instance';
                }
            },
            data: {
                authenticate: true,
            },
            breadcrumb: {
                title: 'Metric Instance - :metricInstanceId',
                path: ['app.home', 'app.metricbase-update', 'app.metricinstance-update']
            }
        })
        .state('app.metricinstance-update.values', {
            url: '/values',
            data: {
                authenticate: true,
            },
            breadcrumb: {
                title: 'Metric Instance - :metricInstanceId',
                path: ['app.home', 'app.metricbase-update', 'app.metricinstance-update']
            }
        })

        // Metric Instance Mass Update
        .state('app.metricInstanceMassUpdate', {
            abstract: true,
            url: '/metrics/massUpdate/instance',
            templateUrl: 'views/partials/metricinstance/metricInstanceMassUpdate.html'
        })
        .state('app.metricInstanceMassUpdate.search', {
            url: '/search',
            templateUrl: 'views/partials/metricinstance/metricInstanceMassUpdateSearch.html',
            controller: 'MetricInstanceMassUpdateSearchController',
            data: {
                authenticate: true,
            },
            breadcrumb: {
                title: 'Metric Instance Mass Update - Mass Update',
                path: ['app.home', 'app.metricInstanceMassUpdate.search']
            }
        })
        .state('app.metricInstanceMassUpdate.history', {
            url: '/history',
            templateUrl: 'views/partials/metricinstance/metricInstanceMassUpdateHistory.html',
            controller: 'MetricInstanceMassUpdateHistoryController',
            data: {
                authenticate: true,
            },
            breadcrumb: {
                title: 'Metric Instance Mass Update - Processing History',
                path: ['app.home', 'app.metricInstanceMassUpdate.history']
            }
        })

        // SYSTEM ADMIN STATES AND NESTED VIEWS ========================================
        .state('app.optionsAdmin', {
            url: '/optionsAdmin',
            templateUrl: 'views/partials/admin/admin-options.html',
            controller: 'OptionsAdminController',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Options Administration',
                path: ['app.home', 'app.optionsAdmin']
            }
        })
        .state('app.workflowAdmin', {
            url: '/workflowAdmin',
            templateUrl: 'views/partials/admin/admin-workflow.html',
            controller: 'WorkflowAdminController',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Workflow Administration',
                path: ['app.home', 'app.workflowAdmin']
            }
        })

        .state('app.announcementAdmin', {
            url: '/announcements',
            templateUrl: 'views/partials/admin/admin-announcement.html',
            controller: 'AnnouncementAdminCtrl',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Announcement Administration',
                path: ['app.home', 'app.announcementAdmin']
            }
        })

        .state('app.metricDeletion', {
            url: '/metricDeletion',
            templateUrl: 'views/partials/admin/admin-MetricDeletion.html',
            data: {
                authenticate: true
            }
        })

        .state('app.metricRating', {
            abstract: true,
            url: '/metricRating',
            templateUrl: 'views/partials/admin/admin-ratingoverride.html'
        })

        .state('app.metricRating.override', {
            url: '/override',
            templateUrl: 'views/partials/admin/admin-ratingoverride-overide.html',
            controller: 'RatingOverrideOverrideController',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Rating Override',
                path: ['app.home', 'app.metricRating.override']
            }
        })

        .state('app.metricRating.pendingapproval', {
            url: '/pendingApproval',
            templateUrl: 'views/partials/admin/admin-ratingoverride-pendingapproval.html',
            controller: 'RatingOverridePendingController',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Rating Override',
                path: ['app.home', 'app.metricRating.override']
            }
        })

        .state('app.metricRating.decisioned', {
            url: '/decisioned',
            templateUrl: 'views/partials/admin/admin-ratingoverride-decisioned.html',
            controller: 'RatingOverrideDecisionedController',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Rating Override',
                path: ['app.home', 'app.metricRating.override']
            }
        })

        // MY METRIC STATES AND NESTED VIEWS ===================================
        .state('app.myMetrics', {
            abstract: true,
            url: '/myMetrics',
            templateUrl: 'views/partials/mymetrics/myMetrics.html',
            controller: 'MyMetricsController'
        })
        .state('app.myMetrics.myRoles', {
            url: '/myRoles',
            templateUrl: 'views/partials/mymetrics/mymetrics-myRoles.html',
            controller: 'MyMetricsMyRolesCtrl',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'My Metrics - My Roles',
                path: ['app.home', 'app.myMetrics.myRoles']
            }
        })
        .state('app.myMetrics.metricBasePendingReview', {
            url: '/metricBasePendingReview',
            templateUrl: 'views/partials/mymetrics/mymetrics-metricBasePendingReview.html',
            controller: 'MetricBasePendingReviewController',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'My Metrics - Metric Base Pending Review',
                path: ['app.home', 'app.myMetrics.metricBasePendingReview']
            }
        })
        .state('app.myMetrics.metricInstancePendingReview', {
            url: '/metricInstance',
            templateUrl: 'views/partials/mymetrics/mymetrics-metricInstancePendingReview.html',
            controller: 'MetricInstancePendingReviewController',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'My Metrics - Metric Instance Pending Review',
                path: ['app.home', 'app.myMetrics.metricInstancePendingReview']
            }
        })
        .state('app.myMetrics.metricValue', {
            url: '/metricValue',
            templateUrl: 'views/partials/mymetrics/mymetrics-metricValue.html',
            controller: 'MyMetricsMetricValueCtrl',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'My Metrics - Metric Values',
                path: ['app.home', 'app.myMetrics.metricValue']
            }
        })
        .state('app.myMetrics.metricValue.pendingReview', {
            url: '/pendingReview',
            templateUrl: 'views/partials/mymetrics/mymetrics-metricValuePendingReview.html',
            controller: 'MyMetricsMetricValuePendingReviewCtrl',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Pending Review',
                path: ['app.home', 'app.myMetrics.metricValue', 'app.myMetrics.metricValue.pendingReview']
            }
        })
        .state('app.myMetrics.metricValue.pendingResubmission', {
            url: '/pendingResubmission',
            templateUrl: 'views/partials/mymetrics/mymetrics-metricValuePendingResubmission.html',
            controller: 'MyMetricsMetricValuePendingResubmission',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Pending Resubmission',
                path: ['app.home', 'app.myMetrics.metricValue', 'app.myMetrics.metricValue.pendingResubmission']
            }
        })
        .state('app.myMetrics.metricValue.pastDueValue', {
            url: '/pastDueValue',
            templateUrl: 'views/partials/mymetrics/mymetrics-metricValuePastDueValue.html',
            controller: 'MyMetricsMetricValuePastDueValueCtrl',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Past Due Value',
                path: ['app.home', 'app.myMetrics.metricValue', 'app.myMetrics.metricValue.pastDueValue']
            }
        })
        .state('app.myMetrics.metricValue.dueDateUpcoming', {
            url: '/dueDateUpcoming',
            templateUrl: 'views/partials/mymetrics/mymetrics-metricValueDueDateUpcoming.html',
            controller: 'MyMetricsMetricValueDueDateUpcomingCtrl',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Due Within 10 Days',
                path: ['app.home', 'app.myMetrics.metricValue', 'app.myMetrics.metricValue.dueDateUpcoming']
            }
        })

        // QUICK INPUT STATES
        .state('app.quickInputMetricValues', {
            url: '/quickInput/metricValues',
            templateUrl: 'views/partials/metricvalue/quickInputMetricValues.html',
            controller: 'QuickInputMetricValuesCtrl',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Quick Input - Metric Values',
                path: ['app.home', 'app.quickInputMetricValues']
            }
        })

        // TODO STATES AND NESTED VIEWS ========================================
        .state('app.myAccess', {
            url: '/myAccess',
            templateUrl: 'views/partials/myAccess.html'
        })
        .state('app.myCollections', {
            abstract: true,
            url: '/myCollections',
            templateUrl: 'views/partials/mycollections/myCollections.html',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'My Collections - Collections',
                path: ['app.home', 'app.myCollections']
            }
        })
        .state('app.myCollections.ownedCollections', {
            abstract: true,
            url: '/ownedCollections',
            templateUrl: 'views/partials/mycollections/mycollections-ownedCollections.html',
            data: {
                authenticate: true
            }
        })

        .state('app.myCollections.ownedCollections.collections', {
            url: '/collections',
            templateUrl: 'views/partials/mycollections/mycollections-ownedCollections-collections.html',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'My Collections - Owned Collections - Collections',
                path: ['app.home', 'app.myCollections.ownedCollections.collections']
            }
        })
        .state('app.myCollections.ownedCollections.associatedInstances', {
            url: '/associatedInstances',
            templateUrl: 'views/partials/mycollections/mycollections-ownedCollections-associatedInstances.html',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'My Collections - Owned Collections - Associated Instances',
                path: ['app.home', 'app.myCollections.ownedCollections.associatedInstances']
            }
        })
        .state('app.myCollections.ownedCollections.associatedRoles', {
            url: '/associatedRoles',
            templateUrl: 'views/partials/mycollections/mycollections-ownedCollections-associatedRoles.html',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'My Collections - Owned Collections - Associated Roles',
                path: ['app.home', 'app.myCollections.ownedCollections.associatedRoles']
            }
        })
        .state('app.myCollections.sharedCollections', {
            abstract: true,
            url: '/sharedCollections',
            templateUrl: 'views/partials/mycollections/mycollections-sharedCollections.html',
            controller : 'SharedCollectionsController',
            data: {
                authenticate: true
            }
        })

        .state('app.myCollections.sharedCollections.collections', {
            url: '/collections',
            templateUrl: 'views/partials/mycollections/mycollections-sharedCollections-collections.html',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'My Collections - Shared Collections - Collections',
                path: ['app.home', 'app.myCollections.sharedCollections.collections']
            }
        })
        .state('app.myCollections.sharedCollections.associatedInstances', {
            url: '/associatedInstances',
            templateUrl: 'views/partials/mycollections/mycollections-sharedCollections-associatedInstances.html',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'My Collections - Shared Collections - Associated Instances',
                path: ['app.home', 'app.myCollections.sharedCollections.associatedInstances']
            }
        })

        .state('app.KRILossImport', {
            url: '/KRILossImport',
            templateUrl: 'views/partials/admin/KRILossImport-Import.html',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'KRI Loss Import',
                path: ['app.home', 'app.KRILossImport']
            }
        })
        .state('app.myAlerts', {
            url: '/myAlerts',
            templateUrl: 'views/partials/myAlerts.html'

        })

        .state('app.confirmationsAttestations', {
            url: '/confirmationsAttestations',
            templateUrl: 'views/partials/confirmationsAttestations.html'
        })

        .state('app.metricCommentary', {
            url: '/metricCommentary',
            templateUrl: 'views/partials/metricCommentary.html'
        })
        .state('app.fileImport', {
            url: '/quickInput/fileImport',
            templateUrl: 'views/partials/metricvalue/metricvalue-file-upload.html',
            controller: 'MetricValueFileUploadCtrl',
            data: {
                authenticate: true
            },
            breadcrumb: {
                title: 'Metric Values - Bulk Upload',
                path: ['app.home', 'app.fileImport']
            }
        })
        .state('app.subGovFileImport', {
            url: '/subGovFileImport',
            templateUrl: 'views/partials/subGovFileImport.html'
        })
        .state('app.subGovAdmin', {
            url: '/subGovAdmin',
            templateUrl: 'views/partials/subGovAdmin.html'
        })
        .state('app.cannedReports', {
            url: '/cannedReports',
            templateUrl: 'views/partials/cannedReports.html'
        })
        .state('app.adHocReports', {
            url: '/adHocReports',
            templateUrl: 'views/partials/adHocReports.html'
        })

        .state('app.userSecurityAdmin', {
            url: '/userSecurityAdmin',
            templateUrl: 'views/partials/userSecurityAdmin.html'
        })

        .state('app.appConfigAdmin', {
            url: '/appConfigAdmin',
            templateUrl: 'views/partials/appConfigAdmin.html'
        });
});
