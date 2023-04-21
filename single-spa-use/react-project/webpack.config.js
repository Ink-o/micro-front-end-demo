const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "jw",
    projectName: "react", // @jw/react
    webpackConfigEnv,
    argv,
  });
  // singleSpaDefaults 默认把 react 和 react-dom 作为外部打包
  // 这里删除里面的内部属性，直接使用现在打包的
  delete defaultConfig.externals
  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    devServer: {
      port: 3000
    }
  });
};
