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
        }),
        app.all('/api/getTestDetails', (req, res) => {
            res.json({
                cookieName: "sessionid",
                cookieValue: "6b820f00-2426-47c3-abfd-3c1f27c1d53d",
                msg: "77777",
                rCode: "0",
                realName: "admin",
                userId: "1",
                userName: "admin"
            })
        })
    }
}

module.exports = apiRoutes