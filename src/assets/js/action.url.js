let ActionUrl = {
    // 登录
    login: {
        login: {
            url: 'api/npms/authenticate/login.action',
            type: 'post'
        },
        register: {
            url: 'login/register',
            type: 'post'
        }
    },
    home: {
        getCatalog: {
            url: 'api/npms/authority/getCatalog.action',
            type: 'post'
        }
    },
    ssp: {
        dspPriority: {
            get: {
                url: 'api/npms/auditssp/getDspConfig.action',
                type: 'post'
            },
            edit: {
                url: 'api/npms/auditssp/dealDspConfig.action',
                type: 'post'
            }
        },
        mediaReview: {
            getUnActed: {
                url: 'api/npms/auditssp/getOpenUsers.action',
                type: 'post'
            },
            getActed: {
                url: 'api/npms/auditssp/getActedOpenUsers.action',
                type: 'post'
            },
            getById: {
                url: 'api/npms/auditssp/getOpenUser.action',
                type: 'post'
            }
        },
        appReview: {
            get: {
                url: 'api/npms/auditssp/getApplications.action',
                type: 'post'
            },
            getById: {
                url: 'api/npms/auditssp/getApplication.action',
                type: 'post'
            },
            getByAdopt: {
                url: 'api/npms/auditssp/getActedApplications.action',
                type: 'post'
            },
            edit: {
                url: 'api/npms/auditssp/auditApplication.action',
                type: 'post'
            }
        },
        appManage: {
            get: {
                url: 'api/npms/controlssp/getApplicationList.action',
                type: 'post'
            },
            closeApp: {
                url: 'api/npms/controlssp/closeApplication.action',
                type: 'post'
            },
            openApp: {
                url: 'api/npms/controlssp/openApplication.action',
                type: 'post'
            }
        },
        adPositionManage: {
            get: {
                url: 'api/npms/controlssp/getAdPositionList.action',
                type: 'post'
            },
            getAdSize: {
                url: 'api/npms/controlssp/queryAllPositionSize.action',
                type: 'post'
            },
            closeAdPosition: {
                url: 'api/npms/controlssp/closeAdPosition.action',
                type: 'post'
            },
            openAdPosition: {
                url: 'api/npms/controlssp/openAdPosition.action',
                type: 'post'
            },
            updateH5Type: {
                url: 'api/npms/controlssp/updateH5type.action',
                type: 'post'
            },
            updateAdType: {
                url: 'api/npms/controlssp/updateAppAdtype.action',
                type: 'post'
            },
            getPicFormat: {
                url: 'api/npms/controlssp/getPicFormats.action',
                type: 'post'
            },
            getInteractType: {
                url: 'api/npms/controlssp/getInteractTypes.action',
                type: 'post'
            },
            getAvailableApp: {
                url: 'api/npms/controlssp/getAvailableApplications.action',
                type: 'post'
            },
            getAdPositionSizeById: {
                url: 'api/npms/controlssp/getAdPositionSizeList.action',
                type: 'post'
            },
            create: {
                url: 'api/npms/controlssp/createAdPosition.action',
                type: 'post'
            },
            update: {
                url: 'api/npms/controlssp/updateAdPosition.action',
                type: 'post'
            },
            getDspVersion: {
                url: 'api/npms/adproxy/dsp/search.action',
                type: 'post'
            },
            updateSDK: {
                url: 'api/npms/controlssp/updateDspSdkVersion.action',
                type: 'post'
            },
            updateStrategy: {
                url: 'api/npms/controlssp/updateDspBasePolicy.action',
                type: 'post'
            },
            getModelByKeyword: {
                url: 'api/npms/control/dsp/getModelsList.action',
                type: 'post'
            },
            updateModel: {
                url: 'api/npms/controlssp/updateAdPositionModels.action',
                type: 'post'
            },
            queryModel: {
                url: 'api/npms/controlssp/queryAdPositionModels.action',
                type: 'post'
            }
        },
        tagManage: {
            get: {
                url: 'api/npms/controlssp/searchTag.action',
                type: 'post'
            },
            add: {
                url: 'api/npms/controlssp/addTag.action',
                type: 'post'
            },
            update: {
                url: 'api/npms/controlssp/modTag.action',
                type: 'post'
            },
            delete: {
                url: 'api/npms/controlssp/deleteTag.action',
                type: 'post'
            }
        }
    }
};

export default ActionUrl;