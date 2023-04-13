import './public-path.js'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

let root
function render(props) {
  const container = props?.container
  root = ReactDOM.createRoot(container ? container.querySelector('#root') : document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
// 如果当前不是qiankun应用，则单独挂载
if (!window.__POWERED_BY_QIANKUN__) {
  render({})
}

// qiankun 要求应用暴露的方式需要是umd格式

export async function bootstrap(props) {
  console.log('bootstrap', props);
}
// 挂载时调用的钩子
export async function mount(props) {
  // 子应用获取全局状态
  props.onGlobalStateChange((newVal, oldVal) => {
    console.log('child', newVal, oldVal);
  })
  props.setGlobalState({
    name: 'jw2'
  })
  // 福应用挂载时会传递 props，props 中会有挂载点
  render(props)
}
export async function unmount(props) {
  console.log('unmount', props);
  root.unmount()
}