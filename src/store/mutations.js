/**
 * 处理数据的唯一途径，state的改变或赋值只能在这里
 * 说明：state中的数据，需要提前在getters中渲染后才可以使用
 */
export const updateAdPositionType = (state, data) => {
    state.adPositionType = data;
};