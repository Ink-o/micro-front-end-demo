module.exports = {
	server: {
		port: 9000
	},
	empShare: {
		name: 'host',
		// 定义其他应用程序的引用映射。key 是别名（引入模块时通过别名引入），值是远程应用的URL
		// 当我们想在当前应用中引用其他应用的模块时，可以使用这个别名
		// 组成部分：变量（远程定义的name）+url
		remotes: {
			'remote': '@remote@http://127.0.0.1:9001/emp.js'
		}
	}
}
