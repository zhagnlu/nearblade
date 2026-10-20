# 刀片与模具十大家族：小类、选型与市场资料研究

研究日期：2026-10-19。用途：内部产品规划、后续详情页资料采集和销售询价字段设计。本轮不修改网站、不提交、不部署。

分类基线为《南京如程科技有限公司—刀片与模具产品手册_整理版》PDF 第 5—14 页。手册逐页对应关系见[手册分类核对](manual-taxonomy-audit.md)。网络资料用于解释行业结构和发现候选产品，不能证明如程已经生产所有市场产品。

证据标记：**M**＝手册明确提及；**E**＝外部厂商或市场资料中观察到；**C**＝名称、具体结构或本厂供货范围仍待确认。M 只证明手册的原始表述，不等于全部规格已经核验。表中 E 项也都需要工厂确认后才能作为本站可售产品发布。

Alibaba 证据分三层：既有正式 Chrome 浏览记录、本轮公开检索结果、未能读取的候选链接。正式 Chrome 本轮返回 `cgWindowNotFound`，因此本轮公开检索不能冒充已登录详情页核验。具体样本与读取状态见[来源索引](research-sources-2026-10-19.json)。未发送询盘，未采信平台生成的供应商排名、推测认证或自动生成的性能总结。

## 一、目录应怎样拆分

保留十个大类，二级优先按工序或功能拆分；结构、材料、尺寸、机型、接口和应用另设属性。以下是研究候选树，包含附件分组，不是已确认 SKU 数量，也不是要求一次上线的页面数量。

| 手册大类 | 建议的二级组织方式 | 应放在属性或筛选中的内容 |
|---|---|---|
| 剪板机刀片 | 板材直线剪切；开平横剪作为待确认扩展 | 上／下刀、整体／分段、Q11／QC12Y 等机型、刃数、材质 |
| 折弯机模具 | 上模、下模、专用成形模、夹持与转接附件 | 角度、R 值、V 口、长度、分段、接口、载荷 |
| 滚剪机刀片 | 金属纵剪圆刀、金属切边圆刀、排刀与分离附件 | 材料、板厚、精度等级、刀轴接口 |
| 分切刀系列 | 剪切式、剃刀式、压切式；刀架附件 | 纸／膜／箔／胶带／锂电等应用、刀材、刃型 |
| 轧钢刀片 | 棒线材剪切、板带剪切、连铸及钢坯剪切；按剪切工位细分 | 冷／热剪、截面、温度、飞剪机构、修复方式 |
| 瓦楞纸切刀 | 纵切薄刀、横切刀、开槽刀；修边及配套件 | 三联／四联设备、纸板层数、齿形、设备品牌及图号 |
| 齿刀系列 | 包装切断齿刀、易撕线齿刀、圆形齿刀、异形齿刀 | V 齿／高低齿／斜齿／波齿、齿距、切断／留连 |
| 油墨刮刀 | 凹印计量刮刀、柔印计量刮刀、腔体封墨刀、涂布刮刀；支撑夹持件 | 基材、涂层、刃口、卷料／定长、墨水体系 |
| 削片机刀片 | 鼓式、盘式、再削片刀；底刀及夹持件 | BX 等机型、可重磨／可转位、木种、含杂质情况 |
| 粉碎机刀片 | 粒径减小用动刀、定刀；另列撕碎刀具待确认扩展 | 平刀／爪刀／V 形安装、材料、孔位、筛网、机型 |

**优先解决的目录问题：**剪板机两个旧产品应归入一个系列的适配项；折弯模具不能只展示多 V 下模；瓦楞纸系列不能只展示开槽弧刀；齿刀不能再被瓦楞纸专用刀完全代表；削片和粉碎不能共用一组泛化长刀图片；金属滚剪与软卷材分切需要按工况解释边界。

## 二、剪板机刀片 — Shear blades

### 产品范围与候选小类

手册 p5 明确涉及 Q11 机械剪板机和 QC12Y 液压摆式剪板机。它们是设备适配维度，不是两个平行大类。TKM 将开平线横剪与剪板机刀片放在同一产品方向，并说明刀材与热处理需随被剪材料选择；这支持研究开平横剪的相邻需求，但不证明本厂已供应该用途。[TKM 横剪与剪板机刀片](https://www.tkmgroup.com/en/cut-to-length-lines-and-guillotine-shears)

| 候选项 | 英文搜索词 | 结构及采购识别点 | 证据与处理 |
|---|---|---|---|
| 机械剪板机适配刀组 | mechanical guillotine shear blades Q11 | 上下刀配套；安装孔、刀座基准决定兼容性 | M，适配项 |
| 液压摆式剪板机适配刀组 | hydraulic swing beam shear blades QC12Y | 不能只按总长替换；核对截面和工作刃几何 | M，适配项 |
| 闸式剪板机适配刀组 | hydraulic guillotine shear blades | 设备运动机构与摆式不同，不能据外观认定互换 | E/C，补机型资料 |
| 上刀／下刀 | upper / lower shear knife | 装配位置不同；图纸可能不同 | E，位置属性 |
| 整体长刀／分段拼接刀 | one-piece / segmented shear blade | 拼接端面、安装基准与接缝质量需要单独确认 | E/C，结构属性 |
| 开平线定尺横剪刀 | cut-to-length shear knife | 连续板带开平后的横向切断 | E/C，候选应用小类 |

### 材料、选型和详情页应补什么

手册列出 9CrSi、5CrW2Si、6CrW2Si、CrWMn、Cr12MoV、H13、H13K、W18Cr4V，并描述最长可达 8 m。网站需要说明这是手册覆盖信息；具体牌号、硬度、长度和加工能力须针对订单确认，不能把所有牌号都写成适合所有板厚。材料选择需要同时考虑耐磨、韧性、崩刃及开裂风险，不能只比较 HRC。[Uddeholm 工业剪切刀材应用](https://www.uddeholm.com/us/en-us/applications/shearing-industrial-knives-en-us/)

建议询价字段：机器制造商／型号／年份、上刀或下刀、L×W×T、孔径／沉孔／孔距／距端尺寸、刃口夹角与可用刃数、板材牌号和强度、厚度范围、切断宽度、现用刀损坏照片、所需数量。以上是建议采集的工程资料，不是统一安装说明。

详情页应展示：刀体全长、端面截面、孔位近照、上下刀配套关系、尺寸图示例、材料选择需要的信息、可重磨条件。毛刺、翻边、崩口、磨钝应分别记录；不能把剪切质量问题全部归为刀材不足。

### Alibaba 样本

既有正式浏览已比较 Ouwei、Huatian、Xinerli、Alas、LD/SKS 五家。可用作不同长刀、孔位和刀组展示的采集起点；此前主要验证图片，尚不足以证明规格兼容。[Ouwei 长刀样本](https://www.alibaba.com/product-detail/Industrial-H13-SKD61-1100-100-25_1601006824568.html)、[Huatian 剪板机刀片样本](https://www.alibaba.com/product-detail/Professional-Manufacturer-Sheet-Metal-Guillotine-Knife_1601772313061.html)。其余链接完整保留在来源索引。

## 三、折弯机模具 — Press brake tooling

### 先分零件，再分成形任务

手册 p6 包含国标／数控系列，以及弯头、刀形、角度、R 形、圆柱形、U 形、折弯压印、集装箱、灯杆及上模快夹。它把轮廓、角度、工艺和终端产品混合描述，网站应重新建立层级。**弯头／鹅颈通常需要核对为上模 Punch，不能一律翻译成 Gooseneck Die。** WILA 明确区分 Punch 与 Die，并指出鹅颈结构的避让空间与承载能力存在取舍。[WILA 模具形状](https://www.wilatooling.com/knowledge-innovation/knowledge-articles/tool-shape/)

| 建议分组 | 可研究的小类 | 英文词 | 状态 |
|---|---|---|---|
| 上模 Punches | 直身／刀形上模 | straight punch / knife punch | M，具体截面 C |
| 上模 Punches | 弯头／鹅颈上模，深鹅颈上模 | gooseneck / deep gooseneck punch | M；深度范围 C |
| 上模 Punches | 锐角上模、90° 等角度规格 | acute angle punch | M；角度是属性 |
| 上模 Punches | R 形／圆柱半径上模 | radius punch / radius insert | M，装配形式 C |
| 下模 Dies | 单 V 下模、双 V／多 V 下模 | single V / two V / multi V die | E；多 V 已有市场图片 |
| 下模 Dies | 可调 V 下模 | adjustable V die | E/C |
| 成形模 | 压平／折边模 | hemming / flattening tools | E；手册相关名称须核对 |
| 成形模 | Z 形台阶／偏移模 | offset / joggle tooling | E/C |
| 成形模 | U 形、压印、特殊轮廓成形模 | U forming / embossing / custom form tool | M，必须看工件图 |
| 行业专用 | 集装箱、灯杆模具 | container / light pole press brake tooling | M，不代表单一标准截面 |
| 附件 | 高精度上模快夹、转接座、加高座 | punch clamp / adapter / extender | 快夹 M；其余 E/C |

WILA 的应用分类包含空气折弯、压底折弯、短边、大半径、压平、偏移和减少压痕等方向。它们用于解释模具的成形任务，不应把“空气折弯”“30°上模”“数控模具”全部放成同一级产品。[WILA 折弯应用](https://www.wilatooling.com/applications/)

压平可以由不同工具方案实现，例如预折后压平的组合工具、弹簧式压平机构等；不能只用一张 V 模照片说明全部压平能力。[WILA 压平模方案](https://www.wilatooling.com/applications/hemming/)

### 接口、材料与询价字段

接口要独立收集：刀柄截面、夹持槽、有效高度、肩部基准、装卸方式、防坠结构、上下模同轴关系。市场存在不同夹持体系，不能仅凭“欧标”“数控”“适配某品牌”就承诺互换。WILA 自身也将标准体系、可调下模、压平模、加高转接件和夹持系统分开组织。[WILA 目录索引](https://catalog.wilatooling.com/WILA-Catalog-GB/toc/)

建议询价：工件展开及成形图、板材强度与厚度、折弯长度、内 R、角度公差、最小折边、回边避让、机器吨位、模具允许线载荷、V 口、上模尖端 R、接口尺寸、整体或分段长度。不要给所有材料套用一个固定 V＝若干倍板厚的保证公式。

材料栏应先确认本厂实际材质、热处理区域和检验方法；Alibaba 标题中的 42CrMo 只是该供应商样本的声明。刀体整体硬度与工作面局部硬度也不能混用。

### Alibaba 样本与采集缺口

既有正式浏览五家：Golin、SYRM、Fangwei、Prima、Ouwei。[Fangwei 上模样本](https://www.alibaba.com/product-detail/Fangwei-Brand-Bending-Machine-Tooling-Press_1601650199945.html)、[Prima V 下模样本](https://www.alibaba.com/product-detail/Precision-Bending-Mold-V-Die-for_1601721663399.html)、[Ouwei 多 V 模及上模混合页面](https://www.alibaba.com/product-detail/Press-Brake-Multi-V-Dies-and_1601152833093.html)。此前已经发现标题说下模、图库却包含上模的情况。后续应分别采集直上模、鹅颈上模、R 模、压平模、行业专用模、夹具；现有多 V 图片无法覆盖这些小类。

## 四、滚剪机刀片 — Metal rotary slitter knives

### 主刀与排刀系统分开

本系列主要面向金属板带纵剪；与软卷材分切虽然共享圆刀外形，但刀厚配组、排刀、剪切间隙和承载工况不同。TKM 的金属纵剪系统包含圆刀、退料环、隔套、调整垫片、分离件和废边切碎刀，说明客户采购的是一套匹配系统，而不只是一个圆片。[TKM 金属刀具系统](https://www.tkmgroup.com/en/industrial-knives-for-the-metal-industry)

| 建议小类／配套项 | 英文词 | 识别重点 | 状态 |
|---|---|---|---|
| 金属纵剪圆刀 | metal rotary slitter knife | OD×ID×T、键槽、侧面基准、成组厚度 | M |
| 金属边部修切圆刀 | rotary side trimmer knife | 修边工位，不能按普通分条刀直接替换 | E/C |
| 精密隔套／间隔环 | precision spacer | 决定排刀间距，含不同结构 | E，附件 C |
| 包胶退料环、钢退料环 | stripper ring | 与圆刀和板厚匹配；不是切削刀片 | E，附件 C |
| 薄调整垫片 | plastic / precision shim | 配组调整，与主刀分开计价 | E，附件 C |
| 分离盘／分离片 | separator disc / tool | 位于分离装置，不能和主刀混图 | E，附件 C |
| 废边切碎刀 | scrap chopper knife | 下游碎边工序，建议关联产品 | E，归属 C |

手册 p7 提及精密与超精密厚度等级、特定内孔公差和表面质量。应为不同等级建参数表，避免所有产品统一写成最高精度。TKM 也把厚度精度、不同表面处理和工作刃质量列为独立技术维度，不能以“镜面更亮”替代切边质量检验。[TKM 纵剪圆刀技术项](https://www.tkmgroup.com/en/rotary-slitter-knives)

建议询价：金属种类／强度／镀层、厚度范围、带宽和成品分条宽度、线速、刀轴直径、OD/ID/T、键槽、刀组数量、排刀图、允许毛刺、厚度配组要求、端面／径向跳动要求、磨刀后的配组方式。厚度公差、平行度、平面度、跳动分别列项，不能只写“高精度”。

Alibaba 已有五家正式浏览记录：Huatian、LD、常州刀片、Xinerli、Sego。[Sego 圆刀样本](https://www.alibaba.com/product-detail/Round-Blade-Knife-Metal-Shear-Blades_1600601404678.html)、[LD 金属滚剪样本](https://www.alibaba.com/product-detail/Roll-Shear-Galvanized-Cutting-Knives-Metal_1600449038689.html)。后续缺少退料环、隔套与整套排刀的独立高质量资料。

## 五、分切刀系列 — Slitting knives for converting

### 按切法建立主层级

DIENES 明确区分 shear、razor、crush/score 三种分切方向；同一刀架平台可能通过不同刀头适应不同切法，刀架不能当作刀片本体。[DIENES 分切设备](https://www.dienesusa.com/products/slitting-machines/)、[DIENES DS4 刀架与刀头](https://www.dienesusa.com/products/shear-cut-holders/shear-cut-knife-holders/ds4-shear-crush-razor-knife-holder/)

| 工艺分组 | 细分对象 | 英文词 | 说明与状态 |
|---|---|---|---|
| 剪切式 | 平圆上刀、碟形上刀 | flat / dished top slitter knife | 上下刀配合；行业 E，手册系列 M |
| 剪切式 | 下刀环／底刀、下刀筒或多槽刀块 | bottom knife / anvil ring / multi-groove block | 与上刀成套确认；E/C |
| 剃刀式 | 三孔刀、长槽刀、注入式小刀 | three-hole / slotted / injector razor blade | 固定薄刃切卷材；E/C |
| 压切式 | 压切／压痕圆刀与砧辊 | crush / score knife and anvil | 不能与剪切上刀互用；E/C |
| 专用刀组 | 胶带、纸、薄膜、金属箔用刀组 | tape / paper / film / foil slitting knives | 应用标签；纸、膜、铝铜箔等 M |
| 新应用研究 | 锂电极片、隔膜分切 | battery electrode / separator slitting | 导言涉及锂电，但具体刀型及工艺 C |
| 附件 | 气动刀架、刀座、定位组件 | pneumatic knife holder / positioning | E/C，附件分组 |

DIENES 的分切参考手册把走料路径、上下刀、剪切角、重叠量、跳动、侧向载荷、修磨与粉尘分别讨论。这说明只写 OD/ID/T 还不足以选型；现场切法和装配参数同样重要。这里只提取选型维度，不把其推荐值当作所有机器的统一设定。[DIENES 分切参考手册](https://www.dienesusa.com/wp-content/uploads/2015/11/Dienes-Slitting-Reference-Guide-2nd-Edition.pdf)

建议询价：材料名称／层结构／厚度或克重、涂层与胶黏性、切法、卷材张力和速度、刀型／尺寸／刃口角、上下刀组合、刀架接口、切边粉尘／毛刺／粘刀／卷边要求、最窄分切宽度、现有工艺故障。锂电极片要额外记录涂层、集流体和切边检测口径，不能由普通纸刀照片推导适用。

手册 p8 的 SKD11、SKH51、Cr12MoV、W6Mo5Cr4V2、W18Cr4V、LD 应保留为原始候选材料列表；不同国家牌号不要自动当成完全等同材料。硬质合金、整体陶瓷、涂层钢是不同材料／结构方向。

Alibaba 已有七家样本，包含 Huatian、Chunfeng、Jiuno、Sinostar、Fenglirui、Dekeer、Ouman。[Ouman 圆刀样本](https://www.alibaba.com/product-detail/Industrial-Circular-Slitting-Blade-Round-Knife_1601578614283.html)、[Chunfeng 下刀堆叠样本](https://www.alibaba.com/product-detail/ChunFeng-Circular-Slitter-Knifem-Factory-Supply_1601958702810.html)。本轮另发现[三孔剃刀产品介绍页](https://www.alibaba.com/product-introduction/Three-Hole-Euro-Razor-Slitter-Blades_60759551845.html)，只能作为找三孔刀的线索，介绍页中的认证和性能推演不采信。

## 六、轧钢刀片 — Steel mill shear knives

### 工位比外形更重要

手册 p9 明确棒材剪切、连铸轧制等用途。行业范围比一张矩形长刀图大得多。ANDRITZ ASKO 按厚板、热带、酸洗修边、棒线材和薄板坯连铸连轧工位组织刀具，列有切头尾、侧剪、分断、钢坯剪、飞剪及碎边等类别。[ASKO 钢厂刀具资料，第 3 页](https://www.andritz.cn/resource/blob/483776/29d55785e219191aa4782eba0b334cf0/download-asko-mill-solutions-en-metals-data.pdf)

| 候选小类 | 英文词 | 工位／结构辨识 | 状态 |
|---|---|---|---|
| 棒材、线材剪切刀 | bar / wire rod shear knife | 按圆、方或其他截面确认工作刃 | M；具体型面 C |
| 钢坯剪刀片 | billet shear knife | 坯料分断，不等于薄板剪 | E/C，手册连铸方向相关 |
| 飞剪刀片 | flying shear knife | 在线随运动材料剪切；机构各异 | E/C |
| 切头尾／切废刀 | crop / cobble shear knife | 切头尾、事故料处理需分工位 | E/C |
| 冷定尺分断刀 | cold dividing shear knife | 冷态成品分断 | E/C |
| 热带轧线剪刀 | hot strip mill shear knife | 鼓式、曲柄式、摆式等设备适配 | E/C，机构作属性 |
| 厚板侧剪及修边刀 | plate side shear / trimmer knife | 与滚剪圆刀系列有交叉，按工位设关联 | E/C |
| 连铸连轧配套剪刀 | continuous casting / CSP shear knife | 须具体到设备位置和工艺温度 | 手册方向 M，型号 C |

不要把“热剪”“冷剪”“飞剪”视为互斥的同一级结构：前两项描述温度工况，飞剪描述设备工作方式。网站可将“棒线材、板带、钢坯”设为应用分组，剪切任务和冷／热状态作属性。

手册列出 6CrW2Si、H13K、LD 及不完整的“1.237”。**保留原文待核对，不能补成 1.2379 或自行替换牌号。** 手册还涉及堆焊修复；是否提供旧刀修复、适用母材及检验要求应另确认。

建议询价：设备与工位、物料截面／尺寸／牌号、实际剪切温度、切断节拍／线速、刀体轮廓和刃口曲线、孔槽及刀座、冷却方式、旧刀失效形式、成对配套要求、是否旧刀修复。热强性、热疲劳、冲击韧性和磨损应分别讨论，不把室温硬度当作热剪寿命指标。

Alibaba 本轮公开检索发现 [Shenlite 轧线飞剪刀](https://www.alibaba.com/product-detail/Flying-Shear-Blade-Rolling-Mill-Flying_1601068095755.html)，标题与属性涉及棒材飞剪、定制尺寸及多种材料。材料串仅作供应商声明，不代表互相等同或本厂可供。正式登录详情和更多店铺仍待补查；平台泛化“flying shear blades”指南混入美发剪等产品，已排除。

## 七、瓦楞纸切刀 — Corrugated converting knives

### 至少按纵切、横切、开槽分清

手册 p10 明确修边分切、三联／四联开槽及生产线薄刀。BHS 将纵切压线机、旋转剪和横切机分别列作设备模块；纵切刀还配有在线磨刀装置。因此“瓦楞纸切刀”不能只配弧形开槽齿刀图片。[BHS 纵切压线机](https://www.bhs-world.com/en/corrugators/individual-machines/slitter-scorer)

| 建议小类 | 英文词 | 外形／任务与识别字段 | 状态 |
|---|---|---|---|
| 生产线纵切薄圆刀 | corrugated slitter scorer knife | 薄圆盘；外径、孔径、厚度、安装孔 | M |
| 修边刀 | corrugated trim knife | 纸板边部修切；确认属于哪一工位 | M，可能与纵切同型 |
| 横切长刀 | corrugator cutoff knife | 横向定长切断；直线／曲线轮廓依设备图纸 | E/C |
| 旋转剪刀具 | corrugator rotary shear knife | 与主横切、纵切工位区分 | E/C |
| 弧形开槽上刀 | arc slotter knife / male slotting knife | 弧度、齿形、孔槽、刀座曲率 | 开槽 M；具体结构 E/C |
| 配对开槽下刀／环 | female slotter knife / slotting ring | 与上刀匹配；不能凭名称确定通用性 | E/C |
| 三联／四联开槽机刀组 | three / four gang slotter knives | 设备配置／刀组适配，不是三种或四种刀材 | M |
| 配套磨轮、刀座及压线轮 | grinding wheel / holder / scoring wheel | 压线轮和磨轮不是切刀，附件单列 | E/C |

开槽刀厂商页面也存在将整条瓦楞线品牌与开槽机适配混写的现象；因此机器品牌列表只能当初筛线索，最终必须核对具体刀座与图号。[HEROHOME 开槽刀资料](https://www.beherohome.com/products/Slotter-Knife.html)

建议询价：纸板三／五／七层等结构、楞型与厚度、刀位工序、设备品牌型号、线速、刀片图号、圆刀 OD/ID/T 与孔位、弧刀内外半径／弧长／槽孔、齿距、槽宽、磨刀装置规格、切口毛边和压塌要求。整条生产线同品牌也可能使用不同规格，不能只凭“适配 BHS”交付。

Alibaba 既有六家弧刀比较记录：Dongbai、Russan、Fengerli、Nanjing Quality、Cangzhou Zhaoli、Sanli。[Sanli 开槽刀](https://www.alibaba.com/product-detail/SKD-11-Corrugated-Board-Slotting-Knife_1601046224262.html)。本轮另找到[株洲 Chuangde 硬质合金纵切圆刀](https://www.alibaba.com/product-detail/Corrugated-Cardboard-Slitter-Circular-Knives-Tungsten_1601259446770.html)。横切工位另有独立设备资料，可用来核对横切与纵切的功能边界。[BHS 横切机](https://www.bhs-world.com/en/corrugators/individual-machines/cutoff)。圆刀和弧刀应分别建资料包；不能把商品属性中可能误填的硬度标尺照搬到本站。

## 八、齿刀系列 — Serrated and perforating knives

### 区分完全切断与保留连接

手册 p11 包含包装、塑料、食品等应用及齿形。行业齿刀既可以切断，也可以形成易撕线。York 将易撕线刀分为圆形和横切两种，并用 cut/tie 表达切开长度与保留连接长度；列有 V 齿、高低齿、变深 V 齿、波形、柱形及斜齿等形态。[York 易撕线刀及齿形](https://www.yorksaw.com/why-choose-perforated-industrial-machine-knives/)

| 建议小类／属性 | 英文词 | 适用研究方向 | 状态 |
|---|---|---|---|
| 包装机横切齿刀 | packaging cutoff serrated knife | 立式／枕式包装、袋膜切断 | M 应用；结构 E |
| 直线易撕线刀 | straight perforating knife | 纸、薄膜、标签等保留连接切口 | E/C |
| 圆形易撕线刀 | circular perforating knife | 连续纵向打断续切口 | E/C |
| 异形包装齿刀 | shaped / pointed / T-shaped packaging knife | 依夹具、切封机构和图纸 | E/C |
| 食品设备齿刀 | food processing serrated machine knife | 必须区分直接切食品与切包装 | M 行业；具体产品 C |
| 齿形属性 | V / high-low / scalloped / slant teeth | 是工作刃形态；不要各建重复大类 | M 齿形方向，具体轮廓 C |

包装刀制造商的资料展示了切塑料包装膜、袋材和胶带的齿刀应用。食品“包装机用”不等于直接食品接触刀具，耐腐蚀和清洁要求需要单独确认。[FEFO 包装齿刀](https://www.fefoknives.com/product/packaging-stainless-steel-serrated-knives/)

手册涉及 SK2、SUS440C／420J2、TC、SKD11、SKH 等；TC、SKH 的完整定义和实际供货牌号需要工厂确认，不凭缩写补写。不能把行业应用直接变成食品接触认证。

建议询价：全切还是易撕、切口形状、cut/tie、齿距／齿高／齿角、单面或双面刃、刀长或外径、孔槽、往复或旋转运动、膜材及层结构、是否热封附近使用、直接食品接触情况。波形边缘与具有留连的易撕刀不能仅凭远景图片互认。

Alibaba 本轮公开检索：[Nanjing Quality 立式包装机齿刀](https://www.alibaba.com/product-detail/Packaging-machine-blade-of-Vertical-machinery_1601006786501.html)。该页面列有不一致交期字段，因此研究仅使用产品名称和用途线索，不引用交期、保修或效率承诺。后续需要补圆形易撕刀、直线易撕刀和食品设备刀的独立店铺样本，不能拿已有瓦楞弧刀充数。

## 九、油墨刮刀 — Printing and coating doctor blades

### 用途、材料、刃口是三套不同维度

手册 p12 包含标准、组合、蓝钢、不锈钢、陶瓷及组合刀架，并列出凹印、柔印、UV、上光、装饰、涂布等用途。**“组合刮刀”目前语义不够清楚，不能直接解释成双刮刀腔体或某种复合材料。**

| 用途分组 | 细分对象／英文 | 页面组织建议 | 状态 |
|---|---|---|---|
| 凹印 | gravure metering doctor blade | 计量用途页，另选刃口及材料 | M |
| 柔印 | flexo metering doctor blade | 与网纹辊配合，记录墨水与辊面 | M |
| 腔式柔印配套 | containment / sealing blade | 与计量刀位置和功能区分 | E/C |
| 涂布与上光 | coating / varnishing doctor blade | 需明确设备和涂布液，不能泛化 | M |
| 特殊印刷 | decorative / label / UV applications | 应用标签，不独立定义刀材 | M |
| 支撑与夹持 | backing blade / holder / chamber accessories | 刀架、背衬、端封件分开 | 刀架 M，其余 E/C |
| 丝印关联 | screen printing squeegee / scraper | 核对实际胶刮／金属刮刀结构 | 手册应用 M，结构 C |

计量与封墨要按实际安装位置分别记录；Allison 的产品指南分别描述 doctoring 与 containment 应用，并区分碳钢、蓝色氧化层钢和不锈钢等产品。不能只凭蓝色外观判断为另一种钢材。[Allison 产品指南](https://www.allisonblades.com/wp-content/uploads/2024/04/Allison-Product-Guide.pdf)

材料方向应分为普通碳钢／蓝钢、不锈钢、涂层钢、聚合物以及特殊陶瓷体系；**陶瓷涂层钢刀、含陶瓷颗粒的镀层刀、陶瓷刀本体不能混写**。Tokyo Seisakusho 展示了钢、不锈钢、SiC 相关镀层及陶瓷产品，同时分别标注基材厚度、刃口厚度与涂层厚度，这些数值必须分栏。[Tokyo Seisakusho 刮刀结构与材料](https://www.tokyoseisakusho.co.jp/en/product-service/blade)

刃口可作为独立选项：圆刃 Round、斜刃 Bevel、台阶薄刃 Lamella；部分厂商还提供双侧薄刃。材料和刃口组合选择，不能把 Lamella 翻译成某种钢材。[PrintBlade 刃口形状](https://printblade.co.uk/doctor-blade-edge-profiles/)

供应形态还包括卷料与定长刀条。不同体系的刮刀、腔体、端封和清洗耗材应分别列项；Daetwyler 也把刮刀产品与腔体端封等耗材分开。[Daetwyler 产品范围](https://swisstec.daetwyler.com/en/?lang=ru)、[PrintBlade 卷料与定长供应](https://fernite.com/doctor-blades-for-paper-industry/)

建议询价：印刷方式、设备及刀架、墨水／涂料体系、辊面材质、线速、计量或封墨位置、带宽／总厚／刃厚／薄刃宽、长度或卷长、刃口轮廓、是否倒角、腐蚀与磨损情况、现有条纹／漏墨／飞墨现象。刮刀是耗材，不能把对辊面的影响简化成“越硬越好”。

Alibaba 本轮公开聚合页可见多个材料方向及供应商：[陶瓷刮刀检索页](https://www.alibaba.com/countrysearch/CN/ceramic-doctor-blade.html)、[Lamella 刮刀检索页](https://www.alibaba.com/countrysearch/CN/printing-lamella-doctor-blade.html)。可见 Dekeer、Yiwu Sainty、Jctprint、Shantou Wingtai 等供应商线索，仍需逐店核对原始详情。本轮另找到 [Jctprint 刮刀原商品链接](https://www.alibaba.com/product-detail/Flexo-Printing-Doctor-Blade-Coating-Machine_1600926830806.html)，公开索引区分 Lamella 与圆刃、刃厚与带材牌号；直接打开内容有限，仍不算正式详情核验。此前找到的 Dongbai 两条详情链接本轮工具不可读，保留为未核验线索；不能算作已经完成多店详情比较。

## 十、削片机刀片 — Wood chipper knives

### 从机器与切削任务拆分

手册 p13 涉及木材削片、刨花板／胶合板等木加工场景，并列出 BX213、BX213B、BX215、BX216、BX216A、BX218、BX218B、BX218-2、BX218E、BX2110、BX2113、BX2113C、BX2116。**这是 13 个机型适配线索，不是 13 种刀具结构。**

ANDRITZ 的削片刀系统分别用于盘式削片、鼓式削片、筛后再削片和锯木线削片头；其可转位双刃系统说明可重磨传统刀与可翻面刀系统需要分开，不能把其他厂商专有系统写成本厂产品。[ANDRITZ 削片刀系统](https://www.andritz.com/products-en/digital-factory/pulp-and-paper/service-solutions/knife-systems)

| 建议小类／配套项 | 英文词 | 区分点 | 状态 |
|---|---|---|---|
| 鼓式削片刀 | drum chipper knife | 鼓辊安装结构；BX 系列仍逐型号核图 | E；手册削片系列 M |
| 盘式削片刀 | disc chipper knife | 刀盘安装、切削角和刀座不同 | E/C |
| 再削片刀 | rechipper knife | 筛后超大片再处理 | E/C |
| 锯木线削片头刀 | sawmill chipping head knife | 与主削片机刀区分 | E/C |
| 传统可重磨刀 | resharpenable chipper knife | 修磨后尺寸与伸出量需要管理 | E/C，结构属性 |
| 可翻面／可更换刀片系统 | reversible / disposable chipper knife | 定位座与压紧结构成套确认 | E/C，不能承诺专利系统替换 |
| 底刀、压板及刀座 | counter knife / clamp / holder | 配套件，分别绘图 | E/C |

木工刨刀、旋切单板刀、刨花机刀环、削片机刀片虽然可能同为长条刀，但作用过程不同。手册提及胶合板行业不能据此推断已覆盖所有旋切刀、刨刀或刨花刀环，应另立候选清单确认。

建议询价：鼓式或盘式、机器制造商与型号、刀座图号、L×W×T、孔槽／定位台阶／刃角、单套数量与重量匹配要求、出刀量基准、树种／含水／树皮／砂石金属污染、原料截面、目标木片尺寸、现有磨损或崩口。削片刀成套与转子匹配要求不能省略。

手册碳素／合金工具钢和复合焊接描述应由工厂进一步给出实际结构；不要把复合焊接自动写成整体高速钢或整体硬质合金。

Alibaba 本轮发现[鼓式 A8 削片刀样本](https://www.alibaba.com/product-detail/Drum-Wood-Chipper-Blade-A8-Chipper_1601455996015.html)，只取得公开标题，正文读取为空，供货商及详细结构尚未核验。另有平台聚合页把削片、刨刀、旋切、粉碎同时塞进标题，不能据关键词认定产品一致。[削片刀市场检索](https://www.alibaba.com/countrysearch/CN/wood-chipper-blades.html)

## 十一、粉碎机刀片 — Granulator / crusher knives

### 粒径减小刀具与撕碎、切粒分开

手册 p14 明确动刀与定刀，以及 ABS、PE、PP、“PT”、尼龙改性料、木材与复合材料等用途。“PT”原文含义待确认，不能自行改成 PET。

ZERMA 将 granulator、shredder、pulverizer 分成不同机器；其备件也把粒碎刀、撕碎刀和磨粉盘分列。因此网站中文“粉碎刀”不能把三种原理全部混在一张通用页面里。[ZERMA 设备分类](https://www.zerma.com/english/machinery/machinery.html)、[ZERMA 磨损备件分类](https://zerma.com/english/machinery/spare_parts.html)

| 候选小类／属性 | 英文词 | 产品边界 | 状态 |
|---|---|---|---|
| 旋转动刀 | granulator rotor knife | 装于转子，与定刀配合 | M |
| 固定刀／底刀 | stator / bed knife | 固定安装，配合间隙需按机器确认 | M |
| 长直平刀 | flat / straight granulator knife | 几何形式，需看孔位和刀座 | E/C |
| 分段／爪形动刀配置 | segmented / claw rotor knife configuration | “爪刀”常涉及刀架安装，不一定是单片外形 | E/C |
| V 形剪切配置 | V-cut rotor configuration | 是转子排刀与剪切方式，不能误标单片刀形 | E/C |
| 单轴撕碎刀块 | single-shaft shredder cutting block | 可转位方刀／刀块，另列候选产品 | E/C |
| 多轴撕碎钩刀 | multi-shaft shredder hook cutter | 刀盘、隔套与轴匹配，另列 | E/C |
| 切粒刀／滚刀 | pelletizer knife / rotor | 挤出切粒用途，不能等同废料粒碎刀 | 边界研究 C |
| 磨粉盘／齿盘 | pulverizer disc / segment | 研磨工具，与刀片系列分开 | E，扩展范围 C |

ZERMA 粒碎机按机边、集中、厚壁料、大体积件、管材型材等场景配置不同转子和进料结构。这些更适合作为应用标签；不宜将所有应用都变成重复刀片产品页。[ZERMA 粒碎设备与转子配置](https://zerma.com/english/machinery/granulators.html)

刀间隙必须按机器、转子及处理材料确定，不能给全站所有粉碎刀一个统一数值。原厂操作手册明确将这些因素列为间隙选择条件。[ZERMA GSH800 操作手册，设置切削刀章节](https://zerma-america.com/wp-content/uploads/2024/12/GSH800-Series-Operating-Manual-2023.pdf)

建议询价：设备／转子型号、动刀或定刀、单片尺寸和孔位、沉头／螺纹、刀座面与刃角、每套数量、现有刀材和失效、塑料品种／玻纤矿物填充比例／金属污染、制品壁厚和尺寸、干湿粉碎、筛孔、目标粒度、修磨余量。刀片、筛网、转速和进料共同影响结果，不能把产量全部归为单片刀材。

Alibaba 本轮可读取的检索样本包含两家刀片供应商：[Liuzhou Lian / LUK 粒碎平刀](https://www.alibaba.com/product-detail/Premium-D2-Steel-Crusher-Knife-Plastic_62184698659.html)、[Hengkun 粉碎刀](https://www.alibaba.com/product-detail/High-quality-D2-H13-Plastic-Granulator_1600799375951.html)。前者出现 D2/SKD11/1.2369 并列，不能由此建立材料等同关系；“超过 OEM”也只是供应商宣传。后者标题与属性列出的材质并不完全一致，需要核对报价和材质证明。

## 十二、跨系列的材料、质量和数据组织

### 材料不要替代产品分类

| 材料／结构方向 | 应收集的信息 | 容易发生的错误 |
|---|---|---|
| 冷作工具钢 | 完整牌号、标准、钢厂、热处理、使用工况 | D2、SKD11、Cr12MoV 等看到近似就当作同一材料 |
| 热作／抗冲击方向 | 实际温度、冲击、热循环、韧性与失效 | 只比较室温硬度；把 H13K 与其他牌号随意等同 |
| 高速钢 | 完整牌号、整体或镶刃结构、修磨方式 | 看到 SKH 缩写自行补成 SKH51 |
| 硬质合金 | 合金牌号、粒度及结合相等可提供资料、整体或镶片 | 把 HRA、HRC、HV 混成同一数字；默认更硬必然更合适 |
| 不锈钢 | 牌号、热处理、介质、耐蚀和清洁条件 | 由“不锈钢”直接推断食品接触合规 |
| 镀层／涂层 | 基体、成分、厚度、刃口覆盖方式、适用介质 | 把陶瓷涂层说成整体陶瓷；把表面硬度说成刀体硬度 |
| 焊接／复合结构 | 刀体与刃材、连接工艺、工作区、修复条件 | 把镶刃刀宣传为整体刀材 |

上述是建议建立的资料字段。最终材料推荐应由工程人员结合工况确认；本报告不根据 Alibaba 列表生成牌号对照表。

### 每个可售小类应有一套独立资料

建议产品记录至少包含：大类、功能小类、中英文名称、证据状态、工序、结构、应用、机器制造商与型号、图号、尺寸图、材料候选、热处理／表面处理、关键检验项、成套关系、附件关系、照片状态和供货确认人。

尺寸表分别管理：长条刀 L/W/T＋孔位；圆刀 OD/ID/T＋键槽；弧刀曲率及槽孔；折弯模具截面＋V/R/高度＋接口；刮刀带宽／基厚／刃厚／薄刃宽／长度。不能用同一个只有“尺寸、材质、用途”的空泛表覆盖十个系列。

照片采集按小类建立任务：全貌、工作刃、安装基准、截面或配套件、实物尺度参考。先核对产品归属，再比较多家店铺；供应商图片只作为内部参考或获准使用的素材，不能证明本厂出货能力。

## 十三、Alibaba 后续查询清单

以下是下一轮正式浏览的检索词，不代表已浏览完成。每个真正计划上线的小类单独比店；优先记录产品标题、店铺、结构照片、图纸、明确规格及冲突字段，保留直接产品链接。

| 大类 | 建议分开的英文查询 |
|---|---|
| 剪板机刀片 | Q11 shear blade; QC12Y swing beam shear blade; cut to length shear knife |
| 折弯模具 | straight press brake punch; gooseneck punch; radius punch; single V die; multi V die; hemming tools; light pole tooling; punch clamp |
| 滚剪刀 | metal rotary slitter knife; side trimmer knife; slitter spacer; rubber stripper ring; scrap chopper knife |
| 分切刀 | dished top slitter knife; bottom slitter ring; crush cut knife; three hole razor slitter; battery electrode slitting knife |
| 轧钢刀 | billet shear knife; hot bar shear knife; flying shear blade rolling mill; crop shear knife; cold dividing shear blade |
| 瓦楞纸刀 | corrugated slitter scorer knife; corrugator cutoff knife; male female slotter knife; corrugated trim knife |
| 齿刀 | VFFS serrated knife; HFFS packaging cutoff knife; straight perforating blade cut tie; circular perforating knife |
| 油墨刮刀 | gravure lamella doctor blade; flexo metering blade; containment blade; ceramic coated doctor blade; backing blade |
| 削片刀 | drum chipper knife; disc chipper knife; rechipper knife; reversible chipper knife; BX216 knife |
| 粉碎刀 | granulator rotor bed knife; plastic crusher knife; single shaft shredder cutting block; twin shaft hook cutter |

已归档的旧店铺记录适合做首轮线索，但不能代替新增小类的结构核验。本轮薄弱项是轧钢、削片、通用齿刀和刮刀的多店原始详情；应在 Chrome 恢复后继续补齐。公开检索得到的市场线索已经加入索引，不将失效、空正文、聚合页或生成介绍页计为完整详情核验。

## 十四、落地优先级与工厂待确认项

1. **先补手册已有但页面表达不足的产品。** 折弯上模／R 模／行业专模与快夹，瓦楞薄圆刀与开槽刀，通用包装齿刀，刮刀材料及用途，削片机型和粉碎动／定刀。先获得每项的本厂照片、图纸和供货确认。
2. **再研究邻近扩展。** 闸式剪板机适配、开平横剪、滚剪附件、剃刀与压切、钢坯与飞剪、瓦楞横切、可转位削片刀、撕碎刀块等，需要确认工艺和生产能力。
3. **暂不因搜索关键词新增大类。** 钻石刀具、条形异形刀和硬质合金，在手册中尚不足以形成清楚的独立产品树；先确定它们属于材料、结构还是明确工艺产品。

发布前必须补齐的具体问题：手册“1.237”完整牌号、“PT”物料含义、“组合刮刀”实际结构、TC/SKH 完整定义、U 形与圆柱模对应的上下模结构、每类实际材料和检验等级、附件是否对外销售、旧刀修复范围、各 BX 机型图号及尺寸。

研究交付物包括本报告、来源索引和[候选分类数据](research-taxonomy-2026-10-19.json)。候选分类数据独立于网站正式目录，未经供货确认不合并进 `content/catalog/products.json`。
