# comment-box

Comment Box 是一款基于 GitHub Issue 的评论组件。使用 Comment Box 通过简单的配置，就可以将 GitHub 下指定仓库的指定issue内容作为评论列表的形式呈现到任意Web页面。

Comment Box 使用 TypeScript + preact 进行开发，得益于 preact 的足够轻量级，CommentBox轻量版本最终构建后的js文件体积在 xxx KB左右（包含preact运行时），可以轻松的嵌入到任意Web页面上。

Comment Box 分为轻量版（comment-box-lite）和完整版（comment-box-full），前者只需要静态js、css资源，通过正确的配置，就可以渲染issue的评论内容，而后者完整版支持GitHub授权登录，并在博客页面进行评论。