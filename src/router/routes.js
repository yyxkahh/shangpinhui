//配置路由信息
export default [
    {
        path: '/center',
        //路由懒加载
        //component右侧数值：放置的是一个箭头函数，当这个home路由被访问的时候，才会执行；
        //当用户访问当前Home的时候，我才加载Home路由组件，不访问，不加载当前Home路由组件
        component: () => import('@/views/Center'),
        meta: { showFooter: true },
        children: [
            //我的订单二级路由
            {
                path: 'myorder',
                component: () => import('@/views/Center/myOrder')
            },
            {
                path: 'grouporder',
                component: () => import('@/views/Center/groupOrder')
            },
            {
                path: '/center',
                redirect: '/center/myorder'
            }
        ]
    },
    {
        path: '/paysuccess',
        component: () => import('@/views/PaySuccess'),
        meta: { showFooter: true },
        /* 只有从支付界面, 才能跳转到支付成功的界面 */
        beforeEnter(to, from, next) {
            if (from.path === '/pay') {
                next()
            } else {
                next('/pay')
            }
        }
    },
    {
        path: '/pay',
        component: () => import('@/views/Pay'),
        meta: { showFooter: true },
        //路由独享守卫
        beforeEnter: (to, from, next) => {
            //进入支付页面，必须从交易页面而来
            if (from.path == '/trade') {
                next()
            } else {
                next(false)
            }
        }
    },
    //交易页面的路由：书写在这里的守卫，路由独享守卫【只负责档期这一个路由】
    {
        path: '/trade',
        component: () => import('@/views/Trade'),
        meta: { showFooter: true },
        beforeEnter: (to, from, next) => {
            //to：去哪个路由
            //from：从哪个路由而来
            //next：放行函数
            //代表的用户从购物车跳转到交易页面，才放行
            if (from.path == '/shopcart') {
                next()
            } else {
                //用户并非从购物车而来  
                //next(false): 中断当前的导航。
                //如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
                next(false)
            }
        }
    },
    {
        path: '/shopcart',
        component: () => import('@/views/ShopCart'),
        meta: { showFooter: true },
    },
    {
        path: '/addcartsuccess',
        component: () => import('@/views/AddCartSuccess'),
        meta: { showFooter: true },
        name: 'addcartsuccess'
    },
    {
        path: '/detail/:skuId',
        component: () => import('@/views/Detail'),
        meta: { showFooter: true }
    },
    {
        path: '/home',
        component: () => import('@/views/Home'),
        meta: { showFooter: true }
    },
    {
        //代表params参数可有可无，务必要加上?
        name: 'search',
        path: '/search/:keyWord?',
        component: () => import('@/views/Search'),
        meta: { showFooter: true },
    },
    {
        path: '/login',
        component: () => import('@/views/Login'),
        meta: { showFooter: false }
    },
    {
        path: '/register',
        component: () => import('@/views/Register'),
        meta: { showFooter: false }
    },
    //重定向 当项目跑起来的时候，访问/ 立马定向到home主页
    {
        path: '*',
        redirect: '/home'
    }

]