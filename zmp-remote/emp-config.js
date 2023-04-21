module.exports = {
	server: {
		port: 9001,
	},
	empShare: {
		name: '@remote', // 输出的模块名
		// 要暴露给其他应用的模块
		// key 为别名，值为模块相对路径
		exposes: {
			'./App': './src/App'
		}
	}
}
