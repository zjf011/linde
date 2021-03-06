define(function (require, exports, module) {
    var Http = require('U/http');

    _g.setLS('SessionKey', '57de1990f97b41a7bbab7fb883483bf6');

    Http.ajax({
        data: {},
        url: '/admin/account/login.do',
        isSync: false,
        lock: false,
        success: function (ret) {
            if (ret.code == 200) {
                _g.setLS('ActiveHouse', ret.data);
                opts.suc && opts.suc(ret.data);
                api.sendEvent({
                    name: 'checkHouse',
                })
            } else if (ret.code == 3003) {
                opts.fail && opts.fail();
                if (!opts.from) {
                    _g.execScript({
                        winName: _g.getLS('rootWinName'),
                        fnName: 'loseActiveHouse'
                    });
                }
            }
        }
    });


    var headerHeight = 0;
    var footerHeight = 0;

    // api && api.setStatusBarStyle({
    //     style: 'dark'
    // });

    api.addEventListener({
        name: 'keyback'
    }, function (ret, err) {
        api.closeWidget();
        // if (window.firstQuit) {
        // } else {
        //     window.firstQuit = true;
        //     setTimeout(function () {
        //         window.firstQuit = false;
        //     }, 500);
        // }
    });


    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('main/index_view'),
        data: {
            showMainFooter: true,
            pageActiveIndex: 0,
            page: [
                {
                    icon: 'is-home',
                    title: '首页',
                    openFlag: true
                },
                {
                    icon: 'is-door',
                    title: '开门',
                    openFlag: false
                },
                {
                    icon: 'is-bbs',
                    title: '论坛',
                    openFlag: false
                },
                {
                    icon: 'is-me',
                    title: '我的',
                    openFlag: false
                }
            ]
        },
        created: function () {

        },
        ready: function () {
            var safeAreaBottom = parseInt(_g.getLS('safeAreaBottom'));
            if (safeAreaBottom) $('#footer').css('padding-bottom', safeAreaBottom + 'px');
            $('#header').css('padding-top', _g.getLS('StatusBarHeight') + 'px');
            setTimeout(function () {
                headerHeight = $('#header').height();
                footerHeight = $('#footer').height();
                window.MainFrameGroup.open();
            }, 0);
        },
        filters: {},
        methods: {
            onFooterTap: function (index) {
                if (index === main.pageActiveIndex) return;
                main.pageActiveIndex = index;
                main.page[index].openFlag = true;
                window.MainFrameGroup.setIndex(index);
            },
            onEntryTap: function (type) {
                var action = {
                    message: function () {
                        _g.openWin({
                            header: {
                                title: '消息中心',
                                rightText: '清空消息'
                            },
                            name: 'home-msg',
                            url: '../home/msg_frame.html',
                            bounces: true,
                            slidBackEnabled: false,
                            bgColor: '#fff',
                            pageParam: {
                                to: 'msg'
                            }
                        });
                    },
                    bbs: function () {
                        _g.openWin({
                            header: {
                                title: '我相关的'
                            },
                            name: 'forum-relatedToMe',
                            url: '../forum/relatedToMe_frame.html',
                            bounces: true,
                            slidBackEnabled: false,
                            bgColor: '#fff'
                        });
                    }
                };
                action[type] && action[type]();
            }
        },
    });

    var sendApi = {}

    window.MainFrameGroup = {
        open: function () {
            api.openFrameGroup({
                name: 'main-group',
                scrollEnabled: false,
                rect: {
                    x: 0,
                    y: headerHeight,
                    w: 'auto',
                    // h: winHeight - headerHeight - footerHeight
                    marginBottom: footerHeight + 1
                },
                index: 0,
                preload: 0,
                frames: [{
                    name: 'home-index-frame',
                    url: '../home/index_frame.html',
                    bounces: true,
                    bgColor: '#fff'
                }, {
                    name: 'openDoor-index-frame',
                    url: '../openDoor/index_frame.html',
                    bounces: true
                }, {
                    name: 'forum-index-frame',
                    url: '../forum/index_frame.html',
                    bounces: true,
                    bgColor: '#fff'
                }, {
                    name: 'me-index-frame',
                    url: '../me/index_frame.html',
                    bounces: true,
                    bgColor: '#fff'
                }]
            }, function (ret, err) {

            });
        },
        setIndex: function (index) {
            api.setFrameGroupIndex({
                name: 'main-group',
                index: index
            });
        }
    };

    (function () {
        window.frameReady = function () {

        };
        window.footerTap = function (data) {
            main.onFooterTap(data.index);
        };
        window.loginSuc = function () {

        };

        window.refreshData = function () {
            _g.getActiveHouse({
                Http: Http
            });
            _.each(main.page, function (value, index) {
                if (value.openFlag) {
                    var frameName = '';
                    switch (index) {
                        case 0:
                            frameName = 'home-index-frame'
                            break;
                        case 1:
                            frameName = 'openDoor-index-frame'
                            break;
                        case 2:
                            frameName = 'forum-index-frame'
                            break;
                        case 3:
                            frameName = 'me-index-frame'
                            break;
                    }
                    if (index != 1) {
                        _g.execScript({
                            winName: 'main-index-win',
                            frameName: frameName,
                            fnName: 'resetHouse'
                        });
                    }
                }
            })
        }
    })();


    module.exports = {};

});
