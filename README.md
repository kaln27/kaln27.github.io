# Juncheng Liao · Academic homepage preview

这是一个独立的本地预览仓库。原网站 `/Users/kaln/ws/kaln27.github.io` 保持不变，当前仓库没有关联远程仓库，也没有推送或发布到公网。

## 本地查看

需要 Node.js 18 或更新版本，无需安装依赖。

```sh
cd /Users/kaln/ws/kaln27-homepage-preview
npm run dev
```

打开终端显示的本地地址，默认是 `http://127.0.0.1:4173/`。端口被占用时会自动尝试下一个端口。预览仅监听本机。

修改内容后运行 `npm run build` 并刷新浏览器。服务直接读取更新后的 `dist/`，不需要重启。`npm start` 可在已有构建的情况下单独启动预览。

## 内容与文件

- `index.html`：个人简介、研究方向、论文、开源贡献、教育和实习经历。
- `cv/index.html`：CV 页面，带浏览器打印 / 另存为 PDF 的入口。
- `publication/2026-01-01-aware-catastrophic-forgetting/index.html`：保留原论文页面地址。
- `assets/styles.css`：所有页面共用的配色、排版、手机适配和打印样式。
- `assets/site.js`：论文图片放大、当前导航提示、CV 打印。
- `files/`：原网站中的论文 PDF、方法图 PDF，以及 BibTeX。
- `scripts/`：无依赖静态构建和本地预览，构建时检查内部链接及资源。
- `dist/`：自动生成的静态网站，可用于后续部署；不提交到 Git。

`/about/`、`/about.html`、`/publications/` 和 `/resume/` 保留为跳转入口。

## 设计来源

根据用户指定的 [Mi Yan 主页](https://miyandoris.github.io/) 和[仓库](https://github.com/MiYanDoris/MiYanDoris.github.io)重新实现，参考版本为 `61e6a576bbc1c9faf6770fc55d39afe4b21919b2`。

保留其浅鼠尾草绿 / 深森林绿方向、顶部导航、左右简介和图片、图文论文行，以及简洁学术排版；针对本人的论文和开源工作重新组织结构。参考主页注明其原始模板来自 [Jon Barron](https://jonbarron.info/)，页脚保留相应设计致谢。

个人信息、头像、论文图和 PDF 来自用户原网站。没有复制参考作者的个人内容、照片、论文或履历。PR 的合并标记沿用原网站；额外的 SGLang PR 只描述贡献内容，不宣称其当前状态。没有引入第三方字体、追踪脚本或在线资源依赖。
