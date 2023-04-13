// 改变 webpack 的静态资源加载地址
if (window.__POWERED_BY_QIANKUN__) {
  console.log(2222, window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__);
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}