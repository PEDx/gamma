## Gamma - `Low Code Editor`

`Gamma` 主要面向移动端运营类 H5 页面的搭建，其主要复用层级是组件。富表单应用或者面向 PC 浏览器的应用不适合使用 `Gamma` 搭建。

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

### 组件需求示例

#### 0、 基础

- 需求：被拖拽进入编辑界面的组件，可以被拖拽编辑组件的大小、位置。拖拽编辑可由组件配置关闭拖拽
  的某些功能。为了保持简单，组件在编辑界面实例化后，不支持拖拽改变组件的父容器。可在组件树界面改变组件的容器。

#### 1、 用户信息组件

- 展示：展示头像及用户名和扩展文字
- 类型：业务组件
- 数据接口：头像图片地址、用户名文字、扩展文字
- 编辑配置：位置、大小、文字、图片
- 需求：用户信息展示是一个常见需求，主要构成为用户头像，用户名，及分数。在不同的页面中，可能变动
  项头像和文字的位置关系、大小、文字颜色、文字粗细、文字长短、文字的类型、图片边框、图片边框颜色。
  组件可能单独出现（如展示活动参与者），也可能出现在列表中（如排名列表），也有可能以成对的形式出现在列表中（CP 排名列表）。
  数据接口可能是接口获取也可能由编辑器配置产生。
- 设计：基于以上需求，用户信息组件可编辑的范围除了组件本身，在组件内部的图片、文字等都需要能编辑。
  组件需要锁定功能，及锁定后组件内部无法被编辑，只能改变组件的位置。
- 开发：如果由开发人员新建代码项目开发，代码项目与编辑器的融合是个问题。如果由编辑器编辑产出，
  编辑器需要一个业务组件编辑模式，专门产出业务组件。产出流程包括一个业务组件的：展示需求的编辑，脚本代码编辑，
  数据接口的定义。还有对业务组件的包装，发布流程等。

#### 2、 文字组件

- 展示：文字
- 类型：基础组件
- 数据接口：展示的文字
- 编辑配置：位置、大小、文字偏移、颜色、大小、类型、粗细、文字省略。
- 需求：文字组件是基础组件，需要满足（CSS）文字的各项配置。
- 设计：满足配置需求
- 开发：由编辑器提供

#### 3、 tab 容器组件

- 展示：文字
- 类型：容器组件
- 数据接口：无
- 编辑配置： 位置、大小、tab 按钮的大小、文字配置、个数
- 需求：容器组件最主要的功能是对内部组件的位置分发和数据分发，及本身的样式配置
- 设计：满足配置需求
- 开发：由编辑器提供
