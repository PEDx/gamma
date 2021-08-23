# `Gamma`

Low Code Editor

`Gamma` 主要面向移动端运营类 H5 页面的搭建，其主要复用层级是组件。通过业务组件的封装，复用业务，并提供一定灵活性。Gamma 通过限定抽象层级，解决特定问题，整个架构简单高效。

### 前端部分 TODO

- [x] 根容器能力添加(页长，布局，标题，脚本，多容器（用作流的替代）)
- [x] 历史记录（基于快照，回退前进）
- [x] 组件树可视化
- [x] 多状态组件
- [x] 重构拖拽编辑类及依赖
- [x] 解决动态渲染右侧配置器的耗时渲染
- [x] 宽高比锁定
- [x] 选择页面布局类型（长页面，多页面，挂件）
- [x] 集成富文本框架 slatejs
- [ ] 集成图片处理（譬如添加文字，滤镜，更改分辨率、压缩图片质量）
- [ ] 集成 pattern.css
- [ ] 集成 animation.css
- [ ] 布局组件的顺序调整
- [ ] 组件系统（版本发布）
- [ ] 组件开发流程
- [ ] 定位方向可调整
- [x] 优化右侧配置组件布局方式
- [ ] 完善吸附功能
- [ ] 添加辅助线功能
- [ ] 层级调整
- [x] 事件系统重构（无法避免要使用事件来解耦，只能完善类型约束）
- [ ] 组件与业务数据绑定流程（或脚本注入）
- [ ] 完善左 panel 界面展示
- [ ] 内存泄露检查
- [ ] 完善 LOGO 及界面
- [ ] 在线多人协同
- [ ] 使用文档
- [ ] 开发文档

### 后端部分 TODO

- [ ] 后端语言框架选型
- [ ] 管理系统 api
- [ ] 构建系统 api
- [ ] 接入现有业务系统

### 构建选型
### 设计初步

`项目`

- 整个搭建周期从创建项目开始，项目中包含一个页面或多个页面

`页面`

- 页面可配置为不同布局和分辨率
- 分辨率是页面的初始设定，不可中途更换（但保留能力）
  - 分辨率适配简单方案：基于活动模板现行的方案，固定 meta 中 viewport 宽度（375px）
  - 分辨率适配复杂方案: 在运行时中，基于当前设备分辨率，基于换算动态生成各个组件中的数值
- 布局包括一屏滚动布局、 固定底栏布局、固定顶栏布局、三段式布局。
  - 布局会被实现为布局容器
- 页面可插入信任的脚本，在脚本中可获取页面的组件树
  - 需要考虑脚本开发时与编辑器的协同

`组件`

- 组件是可复用的核心，可使用 Vue React 或者纯粹的 Dom 来开发组件
  - 引入视图库后会增加运行时，多个不同类型的组件就有多个运行时需要构建引入
- 组件按使用类型分为基础组件、容器组件、业务组件
- 组件可被拖拽添加，可以复制粘贴删除，同级组件可调整 z-index
- 保留实现组件跨级拖拽
- 自定义组件开发流程需要定义
- 组件组合模型
  ```
                  ┌─────┐
            ┌─────┘     └─────┐
            │    ViewData     │
            │ ┌─────┐ ┌─────┐ │
            └─┘  ▲  └─┘  ▲  └─┘
           ┌─────┘       └───────┐
           │                     │
        ┌─────┐               ┌─────┐
  ┌─────┘     └─────┐   ┌─────┘     └─────┐
  │    ViewData     │   │    ViewData     │
  │     ┌─────┐     │   │ ┌─────┐ ┌─────┐ │
  └─────┘     └─────┘   └─┘     └─┘     └─┘
  ```

`编辑功能`

- 支持历史和回退前进功能（基于组件为粒度的全量快照）
  - 以组件为抽象层级，历史功能分为两部分，操作记录和快照
  - （页面层级）快照记录能可视化操作
  - （组件层级）操作记录由按键组合控制前进后退
- 支持按键功能
- 支持展示页面组件树
- 实现拖拽吸附
- 支持预览

`数据`

- 编辑器产出配置数据，配置数据可被保存和构建
- 由编辑器产生的编辑数据分为结构数据和配置数据
- 页面的数据来源有编辑器提供的结构数据和配置数据，以及接口提供的接口数据
- 结构数据就是编辑时插入的各个 dom 结构构成的结构树
- 配置数据就是拖拽及配置产生的数据，每个数据节点对应一个结构节点
- 理想情况下，业务接口数据可以映射到页面的各个组件数据接口里
- 基于以上特点，发布页面拥有运行时，主要是插入结构数据，对每个结构节点赋予配置数据
- 数据配置模型
  ```
  ┌───────────────────┐  ┌────────────────┐
  │      ViewData     │  │  EditableBox   │
  │     -Class        │  │ -Component     │
  │ ┌───────────────┐ │  └───┬─────────▲──┘
  │ │   meta data   │ │      │         │
  │ └───────────────┘ │   SetData    Notify
  │                   │      │         │
  │ ┌──────────────┬┐ │  ┌───▼─────────┴──┐            ┌───────────────┐
  │ │ configurator │┼─┼──┤  Configurator  ├────────────►   Widget      │
  │ └──────────────┴┘ │  │ -Class         │  Notify    │  -Component   │
  │                   │  └───▲─────────┬──┘            ├───────────────┤
  │ ┌───────────────┐ │      │         │               │   ViewData    │
  │ │ configurator  │ │   SetData   Notify             └──────┬────────┘
  │ └───────────────┘ │      │         │                      │
  │                   │  ┌───┴─────────▼──┐                   │
  │  ...              │  │  Configurator  │                   │
  │                   │  │ -Component     │                   │
  └─────────┬─────────┘  └────────────────┘                   │
            │                                                 │
            └─────────────────────────────────────────────────┘
  ```

`构建与管理`

- 管理界面只展示个人创建的项目，或公开的项目
- 管理界面有新建项目功能
- 编辑时产生的 html 结构数据可以用来优化首屏
- 最终构建产物会将配置数据写入 HTML 中，但是组件为异步获取（或者可配置为全部写入 html 中）
- 构建产物还包含运行时，运行时负责通过配置数据初始化组件

`配置器`

- 支持基于拖拽的编辑模式，基于拖拽可以改变组件大小和位置、旋转角度。
- 支持包括数字、文字、富文本、颜色、渐变颜色的基础配置器
- 支持包括位置配置、大小配置、内外边距
- 业务组件支持插入自定义配置器
- 配置分为数据配置、样式配置，样式配置又分有无单位
- 理论上可以支持单位转换
