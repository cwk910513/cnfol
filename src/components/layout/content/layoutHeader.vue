<style scoped lang='scss'>
    @import '../../../assets/scss/layoutHeader.scss';
</style>

<template>
    <a-layout-header class="layout-header">
        <!-- <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => collapsed = !collapsed" /> -->
        <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="changeCollapsedFun" />
    </a-layout-header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            collapsed: false,
        }
    },
    computed: {
        
    },
    methods: {
        // 切换collapsed
        changeCollapsedFun() {
            let self = this;

            self.collapsed = !self.collapsed;
            self.$emit('headerCollapsed', self.collapsed)
        }
    },
    mounted: function() {
        let self = this;

    }
}
</script>