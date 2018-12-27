<style scoped lang='scss'>
    @import '../../assets/scss/dashboard.scss';
</style>

<template>
    <a-layout class="dashboard-content">
        <a-layout-sider :trigger="null" collapsible v-model="collapsed">
            <div class="logo">{{ collapsed ? 'PMS' : 'PMS 运营平台' }}</div>
            <menu-item-component ref="menuItem" v-on:changeAcitveTab="changeActiveTabFun"></menu-item-component>
        </a-layout-sider>
        <a-layout>
            <layout-header-component v-on:headerCollapsed="getHeaderCollapsed"></layout-header-component>
            <div class="tabs-div">
                <a-tabs :activeKey="activeTab" class="tabs-content" @change="changeTab">
                    <a-tab-pane class="tab-item"
                                v-for="tab in tabArray"
                                :key="tab.type"
                                :tab="tab.title"   
                    >
                        <router-view />
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-layout>
    </a-layout>
</template>

<script>
import menuItemComponent from '@/components/layout/content/menuItem.vue';
import layoutHeaderComponent from '@/components/layout/content/layoutHeader.vue';

export default {
    components: {
        menuItemComponent,
        layoutHeaderComponent
    },
    data () {
        return {
            collapsed: false,
            tabArray: [{ 'type': 'home', 'title': '首页', 'active': true, 'path': '/dashboard/' }],      // tab列表
            activeTab: '',     // 激活的tab
        }
    },
    beforeMount() {
        let self = this;
        self.setActiveTab('home');
    },
    methods: {
        // 设置左侧menu是否显示
        getHeaderCollapsed(collapsed) {
            let self = this;
            self.collapsed = collapsed;
        },
        // 设置激活tab
        setActiveTab(type) {
            let self = this;
            self.tabArray = JSON.parse(sessionStorage.getItem('tabListArray'));
            if(self.tabArray) {
                self.activeItem = self.tabArray.filter( tab => { if(tab.type == type) { return tab } });
                self.$set(self, 'activeTab', self.activeItem[0].type);
            }
        },
        // 提供给外部组件调用，用于实施设置激活tab项
        changeActiveTabFun(type) {
            let self = this;
            self.setActiveTab(type);
        },
        // 切换tab时触发事件，点击当前tab不会触发此方法
        changeTab(activeType) {
            let self = this;
            self.tabArray.map( item => {
                item.active = item.type === activeType;
            });
            self.activeItem = self.tabArray.filter( tab => { if(tab.active) { return tab } });
            // 设置激活tab
            self.$set(self, 'activeTab', self.activeItem[0].type);
            // 路由跳转
            self.$router.push({ path: self.activeItem[0].path });
            // 调用menu方法
            self.$refs.menuItem.setAcitveMenu(activeType);
            sessionStorage.setItem('tabListArray', JSON.stringify(self.tabArray));
        },
    }
}
</script>