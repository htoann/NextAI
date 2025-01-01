"use client";

import { ConfigProvider } from "antd";
import { JSX } from "react";

const withTheme = (node: JSX.Element) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#8231D3",
        fontSize: 14,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
      },
    }}
  >
    {node}
  </ConfigProvider>
);

export default withTheme;
