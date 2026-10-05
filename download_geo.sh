#!/bin/bash

# 创建目录
mkdir -p data/geo
cd data/geo || exit 1

# 先下载全国省级边界（必须）
echo "下载 100000_full.json（全国）..."
curl -fSL --retry 3 -o 100000_full.json \
  "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json"

# 全部 34 个省级行政区 adcode
adcodes=(
  110000  # 北京
  120000  # 天津
  130000  # 河北
  140000  # 山西
  150000  # 内蒙古
  210000  # 辽宁
  220000  # 吉林
  230000  # 黑龙江
  310000  # 上海
  320000  # 江苏
  330000  # 浙江
  340000  # 安徽
  350000  # 福建
  360000  # 江西
  370000  # 山东
  410000  # 河南
  420000  # 湖北
  430000  # 湖南
  440000  # 广东
  450000  # 广西
  460000  # 海南
  500000  # 重庆
  510000  # 四川
  520000  # 贵州
  530000  # 云南
  540000  # 西藏
  610000  # 陕西
  620000  # 甘肃
  630000  # 青海
  640000  # 宁夏
  650000  # 新疆
  710000  # 台湾
  810000  # 香港
  820000  # 澳门
)

# 循环下载
for code in "${adcodes[@]}"; do
  echo "下载 ${code}_full.json ..."
  curl -fSL --retry 3 -o "${code}_full.json" \
    "https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json"
  if [ $? -ne 0 ]; then
    echo "  -> 下载失败或文件不存在，跳过 ${code}"
    rm -f "${code}_full.json"
  fi
done

echo "全部下载完成。文件位于 data/geo/ 目录。"