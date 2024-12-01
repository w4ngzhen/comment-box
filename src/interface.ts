interface Options {
  /**
   * GitHub App ClientId
   * @description 用于登录跳转至对应 GitHub App 进行授权。
   */
  clientId: string;
  /**
   *
   */
  authCallbackUrl: string;
  /**
   * 存放Issues的仓库的owner
   */
  owner: string;
  /**
   * 存放Issues的仓库
   */
  repo: string;
  /**
   * GitHub上的issue的唯一性由其id确定，但无论是人工还是API方式创建issue，我们均无法自定义该id值。
   * 然而在实际使用中，我们需要在不同的页面下，加载对应的某个issue下的comments列表。
   * 因此，我们设计这样一种issue定位的方式：由使用者传入一个能够代表issue的唯一key，
   * 我们使用该key与repo中的issue列表中包含有该key值的label进行匹配，找到对应的issue。
   * 如果不存在该issue，则在创建阶段，我们调用API完成一个issue的创建后同时给该issue添加一个值为key的label。
   * 当然，上面描述的是组件内部对issue定位的原理，如果你只是一个使用者的话，只需要注意以下几点：
   * 1. 传入的issueKey能够确保每一个页面上都是唯一的。
   *    比如，你可以使用pathname作为唯一issueKey。
   *    然而需要注意的是，label是有字符串长度限制的，如果你能够确保pathname不会特别长的话，那么就可以直接使用。
   *    但是如果你无法保证的话，建议使用一个摘要方法来对pathname进行摘要
   *    （譬如使用md5，将pathname摘要为一个固定长度的随机字符串，但这样会丧失一定的可读性）
   * 2. 因为issueKey对应的是repo中的某一条带有该key值的label的issue，因此，请不要随意修改仓库中的issue的label。
   */
  issueKey: string;
  /**
   * 评论记录分页大小
   * @defaultValue 20
   */
  commentPageSize?: number;
  /**
   * 评论内容样式
   * GitHub Issue支持返回纯文本的评论内容以及带有DOM结构的评论内容（通常是markdown转换后的html）
   * 该选项配置支持两种其一 或 均启用（both）
   * 当使用 both 时，每条评论的UI上会显示切换按钮用于用户按照喜好进行切换
   * @defaultValue pure
   */
  commentContentRenderStyle?: 'pure' | 'rich' | 'both';
}
