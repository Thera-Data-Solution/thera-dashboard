import { ConfigProvider } from "antd";
import DefaultRouter from "./router";

export default function App() {
  return (
    <ConfigProvider>
      <DefaultRouter />
    </ConfigProvider>
  );
}
