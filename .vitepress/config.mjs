import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "一只锅的知识世界", // 网站标题
  description: "一只锅的知识世界", // 网站描述
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // 导航栏
      { text: "首页", link: "/" },
      { text: "example", link: "/markdown-examples" },
      { text: "API", link: "/api-examples" },
      { text: "指南", link: "/guide/getting-started" },
    ],

    sidebar: [
      // 侧边栏
      {
        text: "example",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
      {
        text: "指南",
        items: [{ text: "初次开始", link: "/guide/getting-started" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
