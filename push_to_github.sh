#!/bin/bash

echo "请输入您的 GitHub Personal Access Token:"
read -s token

echo "正在推送代码到 GitHub..."
git push https://remix-pengkefei:$token@github.com/remix-pengkefei/tarot-app.git main

echo "推送完成！"