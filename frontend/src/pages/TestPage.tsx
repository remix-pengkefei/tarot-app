import { useState } from 'react';
import { useDivinationStore } from '../services/store';

const TestPage = () => {
  const [log, setLog] = useState<string[]>([]);
  const { currentDivination, startDivination, drawCards } = useDivinationStore();

  const addLog = (message: string) => {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testFullFlow = async () => {
    try {
      addLog('开始测试...');
      
      // 1. 创建占卜
      addLog('1. 创建占卜会话...');
      await startDivination('测试问题：我的未来会怎样？');
      addLog('✅ 占卜创建成功');
      
      // 等待状态更新
      setTimeout(async () => {
        const state = useDivinationStore.getState();
        addLog(`当前占卜ID: ${state.currentDivination?.id}`);
        
        if (state.currentDivination) {
          // 2. 抽牌
          addLog('2. 抽取塔罗牌...');
          const drawnCards = [
            { cardId: 1, position: '过去', isReversed: false },
            { cardId: 2, position: '现在', isReversed: true },
            { cardId: 3, position: '未来', isReversed: false }
          ];
          
          await drawCards(drawnCards);
          addLog('✅ 抽牌完成');
          
          // 3. 检查结果
          setTimeout(() => {
            const finalState = useDivinationStore.getState();
            addLog(`占卜结果: ${JSON.stringify(finalState.currentDivination?.divinationCards?.length || 0)} 张牌`);
          }, 1000);
        }
      }, 1000);
      
    } catch (error: any) {
      addLog(`❌ 错误: ${error.message}`);
    }
  };

  const testAPI = async () => {
    try {
      addLog('测试API连接...');
      const response = await fetch('http://localhost:3001/api/health');
      const data = await response.json();
      addLog(`✅ API响应: ${JSON.stringify(data)}`);
    } catch (error: any) {
      addLog(`❌ API错误: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">测试页面</h1>
      
      <div className="mb-4 space-x-4">
        <button onClick={testAPI} className="btn-primary">
          测试API连接
        </button>
        <button onClick={testFullFlow} className="btn-primary">
          测试完整流程
        </button>
        <button onClick={() => setLog([])} className="btn-secondary">
          清空日志
        </button>
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="font-bold mb-2">日志：</h2>
        <pre className="text-sm whitespace-pre-wrap">
          {log.join('\n') || '暂无日志'}
        </pre>
      </div>
      
      <div className="mt-4">
        <h2 className="font-bold mb-2">当前状态：</h2>
        <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          {JSON.stringify(currentDivination, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TestPage;