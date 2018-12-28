let apiRoutes = {
    beforeFun: (app) => {
        app.all('/api/chuwk/login', (req, res) => {
            res.json({
                code: '0',
                msg: '操作成功！',
                data: {
                    cookieValue: '6b820f00-2426-47c3-abfd-3c1f27c1d53d',
                    userId: '1',
                    userName: 'admin'
                }
            })
        })
    }
}

module.exports = apiRoutes