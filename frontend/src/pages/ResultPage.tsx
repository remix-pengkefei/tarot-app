import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivinationStore } from '../services/store';

const ResultPage = () => {
  const navigate = useNavigate();
  const { currentDivination, reset } = useDivinationStore();

  useEffect(() => {
    console.log('ResultPage - currentDivination:', currentDivination);
    if (!currentDivination) {
      console.log('No divination found, redirecting to home');
      navigate('/');
    } else if (!currentDivination.divinationCards) {
      console.log('No divination cards found, waiting...');
      // 给一点时间让数据加载
      const timer = setTimeout(() => {
        if (!currentDivination.divinationCards) {
          console.log('Still no cards, redirecting to home');
          navigate('/');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentDivination, navigate]);

  const handleNewDivination = () => {
    reset();
    navigate('/');
  };

  if (!currentDivination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">[加载中...]</p>
          <button onClick={() => navigate('/')} className="btn-wireframe">
            [返回首页]
          </button>
        </div>
      </div>
    );
  }

  if (!currentDivination.divinationCards || currentDivination.divinationCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">[正在加载占卜结果...]</p>
          <p className="mb-4">如果长时间未加载，请返回重试</p>
          <button onClick={() => navigate('/')} className="btn-wireframe">
            [返回首页]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="wireframe-card mb-6">
        <h1>占卜结果</h1>
        
        <div className="border-2 border-black p-4 mb-4">
          <p><strong>您的问题：</strong></p>
          <p>{currentDivination.question}</p>
        </div>
        
        <div className="mb-4">
          <p><strong>使用牌阵：</strong>{currentDivination.spread.name}</p>
        </div>
      </div>
        
        <div className="space-y-4">
          {currentDivination.divinationCards.map((divinationCard, index) => (
            <div key={divinationCard.id} className="wireframe-card">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Card visual */}
                <div className="flex-shrink-0">
                  <div className="border-2 border-black p-4 w-32 h-48 flex flex-col items-center justify-center text-center">
                    <h3 className="font-bold mb-2">
                      {divinationCard.card.name}
                    </h3>
                    <p className="text-sm">
                      {divinationCard.card.arcana === 'Major' ? '大阿尔卡纳' : '小阿尔卡纳'}
                    </p>
                    {divinationCard.card.suit && (
                      <p className="text-sm">{divinationCard.card.suit}</p>
                    )}
                    <div className="mt-4 text-xl font-bold">
                      [{divinationCard.isReversed ? '逆位' : '正位'}]
                    </div>
                  </div>
                </div>
                
                {/* Card interpretation */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    {index + 1}. {divinationCard.position}
                  </h3>
                  
                  <div className="mb-4">
                    <p>
                      <strong>关键词：</strong>{typeof (divinationCard.card.keywords as any) === 'string' 
                        ? (divinationCard.card.keywords as any).split(',').join('、')
                        : (divinationCard.card.keywords as string[]).join('、')}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="leading-relaxed">
                      {divinationCard.interpretation}
                    </p>
                  </div>
                  
                  <details className="border-2 border-black p-2">
                    <summary className="cursor-pointer font-bold">
                      [查看牌义详情]
                    </summary>
                    <div className="mt-2 p-2 border-t-2 border-black">
                      <p className="mb-2">
                        <strong>正位含义：</strong> {divinationCard.card.uprightMeaning}
                      </p>
                      <p>
                        <strong>逆位含义：</strong> {divinationCard.card.reversedMeaning}
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 总结性解读 */}
        {currentDivination.summary && (
          <div className="wireframe-card mt-6">
            <h2 className="text-xl font-bold mb-4">整体洞察</h2>
            <div className="whitespace-pre-wrap leading-relaxed">
              {currentDivination.summary}
            </div>
          </div>
        )}
        
      <div className="mt-8 text-center">
        <button
          onClick={handleNewDivination}
          className="btn-wireframe"
        >
          [开始新的占卜]
        </button>
      </div>
    </div>
  );
};

export default ResultPage;