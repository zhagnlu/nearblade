# 刀片页面逐类纠正

日期：2026-10-20。上一批目录及折弯模具修改已按用户要求提交为 `84f8a81`；本记录及刀片纠正是其后的本地工作，未再次提交、推送或部署。

## 逐类结论

| 系列 / 页面 | 问题 | 本轮处理 |
| --- | --- | --- |
| 剪板机刀片 | 固定孔数的通用长刀图不能代替所有机型刀图 | 保留已选照片；改用无预设安装孔数量的刀体及上下刀刃示意。Q11、QC12Y 继续作为适配机型，不新拆分类 |
| 金属滚剪圆刀 | 与纸膜分切仅因都是圆片就共用截面；统一写 ±0.005mm 未明确受控尺寸 | 独立厚环圆刀及厚度示意；区分刀厚、内孔配合和跳动，公差按批准图纸确认；图库改为 contain，防止裁切圆刀 |
| 纸膜 / 箔材分切 | 仅有圆刀 OD/ID/T，不解释切法和配刀 | 保留合适的圆刀照片，独立单面斜刃示例；补充剪切、剃刀、压切的切法边界。箔材另要求合金、厚度、配刀及切边验收方法 |
| 棒材 / 连铸轧线剪刀 | 继承了剪板机的安装和刃数说明，Hero 仍为混合刀片图 | 独立圆截面及方截面剪切轮廓示例；按工位、材料截面、温度、刀座和重磨限制选型。冷/热是工况，飞剪是运动方式，不作为互斥型号 |
| 瓦楞纸薄圆刀 | 与开槽弧刀及金属圆刀混用 | 独立薄圆刀和刃部厚度示例，区分切刀与压线工具；核对磨刀系统、纸板和运行速度 |
| 瓦楞开槽弧刀 | 原为直齿刀示意 | 保留已有白底弧刀照片，改为弧形轮廓、定位槽及刀厚示意；不把图中的两刀间距当成通用槽宽；三联/四联不是通用半径 |
| 包装齿刀 | 手册拼图混有锯片、刀盘等，无法说明某个包装切口 | 独立连续齿刃与齿距示意；区分完整切断与带连接桥的易撕孔线；移除混合拼图图库 |
| 凹印 / 柔印刮刀 | 刃条图可以共用，但工艺不应完全相同 | 保留各自明确记录：凹印针对版辊，柔印针对网纹辊及腔体中的计量/封墨角色；刃口图展示薄刃、斜刃、圆刃例子，不指定通用尺寸 |
| 刮刀夹持器 | 缺图且被排除在选型指南之外 | 独立刀条、夹板及安装截面示例，恢复其尺寸和接口指南，不再显示刀片混合 Hero |
| 削片刀 | 原图库是木工刀、锯片、刀环及配件拼图；继承剪板机尺寸说明 | 独立刀座、出刀量、刃角和重磨资料；替换为无标识白底削片刀三视图候选，见图片记录。BX 型号仍需逐型号核图，不推导兼容性 |
| 粉碎机动刀 / 定刀 | 原拼图包括撕碎盘、方块刀及造粒滚刀，不对应两个子页；同用剪板机说明 | 分开动刀、定刀轮廓，并用选中部件着色显示转子与定刀的关系。要求刀座、配组、重磨与设备规定的间隙，不给通用安装数值 |

21 个刀片页面均有显式记录，集中于 `content/catalog/blade-details.json`。不再让轧钢、削片、粉碎系列继承剪板机指南；`ProductDetail` 也不再把瓦楞薄刀硬切换为普通分切刀指南。13 种 SVG 是说明性轮廓及选型尺寸示例，不是特定机型制造图、安装位置或间隙设定。

图片缺口仍按真实状态保留：工程图不能记为采集完成的实拍。当前新接入的照片只有削片刀三视图候选；其他被撤下拼图的系列仍需继续找清楚、用途对应的照片。

## 专业资料交叉核对

- [TKM 金属纵剪圆刀](https://www.tkmgroup.com/en/rotary-slitter-knives)：厚度等级、表面、工作刃及配套排刀系统需分别核对，未复制其数值指标为本厂承诺。
- [TKM 横剪与剪板机刀](https://www.tkmgroup.com/en/cut-to-length-lines-and-guillotine-shears)：刀材及处理与被剪材料有关。
- [TKM 纸加工刀具](https://www.tkmgroup.com/en/paper-processing-industry)及 [DIENES 分切工艺](https://www.dienesusa.com/products/slitting-machines/)：上下分切刀、下刀及多槽刀块是不同部件，切法需先确定。
- [ASKO 钢厂刀具资料](https://www.andritz.cn/resource/blob/483776/29d55785e219191aa4782eba0b334cf0/download-asko-mill-solutions-en-metals-data.pdf)及 [ANDRITZ ASKO](https://www.andritz.com/metals-en/service-solutions/asko-products-services)：按棒线、钢坯、板带及剪切工位识别需求；不从平直外形推断安装互换。
- [BHS Slitter Scorer](https://www.bhs-world.com/en/corrugators/individual-machines/slitter-scorer)：纵切、压线和磨刀关联，不能把 scoring 翻成切刀的另一种刃口。
- [PrintBlade 刃口](https://printblade.co.uk/doctor-blade-edge-profiles/)：薄刃、斜刃、圆刃属于刃口几何；材料、涂层另行确认。
- [ANDRITZ 木工刀系统](https://www.andritz.com/products-en/digital-factory/pulp-and-paper/service-solutions/knife-systems)：削片刀、底刀及夹持系统配套，不移植供应商专有系统兼容性。
- [Cumberland 粉碎机选项](https://www.cumberlandplastics.com/knowledge-center/granulator-options/)及 [常见问题](https://www.cumberlandplastics.com/knowledge-center/granulator-faqs/)：转子刀与固定刀配合；刀座、配置和间隙随机器而变。未复制其具体间隙或螺栓扭矩。

## Alibaba 正式浏览器证据

使用已登录 Chrome 正常搜索，未发送询盘或聊天消息；供应商自行弹出的聊天广告不是本方发送内容。结果列表和已查看的商品相册分开记录。

1. `metal rotary slitter knives`：候选包括 Sharp、Dekeer、Huatian、Licheng、Xinerli、Chunfeng 等，结果亦混有纸刀、肉类切刀。[Huatian 详情](https://www.alibaba.com/product-detail/High-Quality-Cold-Carbon-Steel-Cutting_1601715065719.html)已打开并查看主图：有品牌和水印，不选。不能只凭该标题把所有圆片判断为金属纵剪刀。
2. `plastic granulator rotor bed knives`：Huaxin、Vicut、Sainty、Sharp、Naditong、Shuangyang 等候选中有撕碎刀、粉碎刀、制粒滚刀混用。[Huaxin 详情](https://www.alibaba.com/product-detail/Plastic-Scrap-Processing-Granulator-Blades-Pelletizer_1601388609768.html)已打开并查看主图，其为带轴多齿滚刀且有水印，不用于本轮平面动刀/定刀页面。
3. 尝试打开既有 [A8 鼓式削片刀候选](https://www.alibaba.com/product-detail/Drum-Wood-Chipper-Blade-A8-Chipper_1601455996015.html)时再次出现 `cgWindowNotFound`，没有把这次导航记作已查看详情。已经异步提示用户保持桌面解锁及 Chrome 可见。

其余各类型仍参考上一轮内部来源索引，不能据此声称本轮每类已完成五家相册核对。新增公开候选原图、像素和取舍见 `media-audit.json`。

## 实际页面检查

Chrome 中已检查瓦楞薄刀 Hero/尺寸面板、开槽弧刀指南、金属滚剪指南、纸膜分切指南、棒材刀 Hero/尺寸面板和连铸刀 Hero/尺寸面板。检查时发现纸膜刀截面过于抽象、弧刀的刀间距易被理解为通用槽宽，均改为明确刃部截面或刀厚；弧半径引线与圆心也已校正。棒材半径标注从工件引线改为刀刃轮廓半径。

尺寸面板增加可点击放大，仍渲染原生且可翻译的 SVG；手机放大容器允许横向查看，避免细字全部缩成几像素。窗口连接中断后，这一新增放大流程和削片刀三张新照片尚未完成实际页面验收；不能用构建通过代替。
