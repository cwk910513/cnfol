/**
 * 数据的异步处理
 * 说明：actions中自己定义一个方法，供外部调用，然后通过commit调用mutations中改变数据内容的方法
 */
export const updateAdPositionTypeFun = ({ commit }, data) => {
    commit('updateAdPositionType', data);
};