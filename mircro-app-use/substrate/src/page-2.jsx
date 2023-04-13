export default function Page1() {
  return <div>
    React项目
    {/* 这个标签是通过 webComponents 来实现的 */}
    <micro-app
      name="app1"
      url="http://localhost:10000"
      baseroute="/react"
    />
  </div>
}