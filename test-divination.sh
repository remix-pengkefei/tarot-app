#!/bin/bash

echo "测试塔罗占卜完整流程..."
echo ""

# 1. 创建占卜
echo "1. 创建占卜会话..."
DIVINATION_RESPONSE=$(curl -s -X POST http://localhost:3001/api/divination/start \
  -H "Content-Type: application/json" \
  -d '{"question":"我的事业发展会顺利吗？"}')

DIVINATION_ID=$(echo $DIVINATION_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "占卜ID: $DIVINATION_ID"
echo ""

# 2. 显示推荐的牌阵
echo "2. 推荐的牌阵信息："
echo $DIVINATION_RESPONSE | python3 -m json.tool | grep -E "(name|description|spreadRecommendation)" | head -5
echo ""

# 3. 抽牌
echo "3. 抽取塔罗牌..."
DRAW_RESPONSE=$(curl -s -X POST http://localhost:3001/api/divination/draw-cards \
  -H "Content-Type: application/json" \
  -d '{
    "divinationId": "'$DIVINATION_ID'",
    "drawnCards": [
      {"cardId": 1, "position": "过去", "isReversed": false},
      {"cardId": 2, "position": "现在", "isReversed": true},
      {"cardId": 3, "position": "未来", "isReversed": false}
    ]
  }')

echo "抽牌完成"
echo ""

# 4. 查看占卜结果
echo "4. 查看完整占卜结果..."
RESULT=$(curl -s http://localhost:3001/api/divination/$DIVINATION_ID)

echo "占卜结果："
echo $RESULT | python3 -m json.tool | grep -A 10 "interpretation" || echo "未找到解读内容"

echo ""
echo "测试完成！"