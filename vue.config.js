const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
function resolve(dir) {
	return path.join(__dirname, dir)
}
module.exports = {
	lintOnSave: false,
	chainWebpack(config) {
		// set svg-sprite-loader
		config.module
			.rule('svg')
			.exclude.add(resolve('src/icons'))
			.end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]'
			})
			.end()
	},
	configureWebpack: {
		optimization: {
			minimizer: [
				new UglifyJsPlugin({
					uglifyOptions: {
						warnings: false,
						compress: {
							pure_funcs: ['console.log', 'console.debug']
						}
					}
				})
			]
		},
		resolve: {
			alias: {
				// eslint-disable-next-line no-undef
				'@': resolve('src'),
			},
		},
	},




	//配置参数
	/**
	 * devServer.proxy 
	 * 如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请 求代理到 API 服务器
	 */
	devServer: {
		proxy: {
			'/tianxing': {
				target: 'http://api.tianapi.com',//天行数据
				ws: true,
				changeOrigin: true,
				pathRewrite: {//重写路径
					'^/tianxing': ''
				}
			},
			'/wa': {
				target: 'https://vyps.api.storeapi.net',//挖数据
				ws: true,
				changeOrigin: true,
				pathRewrite: {//重写路径
					'^/wa': ''
				}
			},
			'/juhe': {
				target: 'http://apis.juhe.cn',//聚合接口地址
				ws: true,
				changeOrigin: true,
				pathRewrite: {//重写路径
					'^/juhe': ''
				}
			},
			//360接口
			'/360': {
				target: 'https://bang.360.cn',//360
				ws: true,
				changeOrigin: true,
				pathRewrite: {//重写路径
					'^/360': ''
				}
			},
			'/qq': {
				target: 'https://api.inews.qq.com',//
				ws: true,
				changeOrigin: true,
				pathRewrite: {//重写路径
					'^/qq': ''
				}
			},
		},
	}
}