export default function Page1() {
  return <div>
    Vue项目
    {/* 这个标签是通过 webComponents 来实现的 */}
    <micro-app
      name="app2"
      url="http://localhost:8080"
      baseroute="/vue"
    />
  </div>
}