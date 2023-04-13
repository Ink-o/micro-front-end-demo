import WujieReact from "./components/wujie-react";

export default function page2() {
  return <WujieReact
    name="VueApp"
    url="http://localhost:8080"
    width="100%"
    height="100%"
    sync={true}
  ></WujieReact>
}