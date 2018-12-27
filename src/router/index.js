import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 登录模块
import login from '@/components/login/login';
// 工作台模块
import dashboard from '@/components/layout/dashboard';
// 欢迎首页
import home from '@/components/home';
// ssp模块
import dspPriority from '@/components/ssp/dspPriority';
import mediaReview from '@/components/ssp/mediaReview';
import appReview from '@/components/ssp/appReview';
import mediaManage from '@/components/ssp/mediaManage';
import appManage from '@/components/ssp/appManage';
import adPositionManage from '@/components/ssp/adPositionManage';
import tagManage from '@/components/ssp/tagManage';
import adPositionShare from '@/components/ssp/adPositionShare';

Vue.use(Router)

let router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: login
        }, 
        {
            path: '/dashboard',
            title: '工作台',
            component: dashboard,
            children: [
                {
                    path: '/dashboard/',
                    name: 'home',
                    title: '欢迎首页',
                    meta: {
                        requireAuth: true,
                    },
                    component: home
                },
                {
                    path: '/dashboard/SspDspPriority',
                    title: 'DSP优先级配置',
                    meta: {
                        requireAuth: true
                    },
                    component: dspPriority
                },
                {
                    path: '/dashboard/SspMediaReview',
                    title: '媒体主审核',
                    meta: {
                        requireAuth: true
                    },
                    component: mediaReview
                },
                {
                    path: '/dashboard/SspAppReview',
                    title: '应用审核',
                    meta: {
                        requireAuth: true
                    },
                    component: appReview
                },
                {
                    path: '/dashboard/SspMediaManage',
                    title: '媒体主管理',
                    meta: {
                        requireAuth: true
                    },
                    component: mediaManage
                },
                {
                    path: '/dashboard/SspAppManage',
                    title: '应用管理',
                    meta: {
                        requireAuth: true
                    },
                    component: appManage
                },
                {
                    path: '/dashboard/SspAdpositionManage',
                    title: '广告位管理',
                    meta: {
                        requireAuth: true
                    },
                    component: adPositionManage
                },
                {
                    path: '/dashboard/SspTagManage',
                    title: '标签管理',
                    meta: {
                        requireAuth: true
                    },
                    component: tagManage
                },
                {
                    path: '/dashboard/SspAdpositionShare',
                    title: '广告位分成管理',
                    meta: {
                        requireAuth: true
                    },
                    component: adPositionShare
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    NProgress.start();
    if (to.meta.requireAuth) {
		if(sessionStorage.getItem("loginAuth")) {
			next();
		}else {
			next({
				path: '/login',
				query: {redirect: to.fullPath}    // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}
    }
    else {
        next();
    }
});
 router.afterEach(transition => {
    NProgress.done();
 });

export default router;