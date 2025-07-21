import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivinationStore } from '../services/store';

const SpreadRecommendationPage = () => {
  const navigate = useNavigate();
  const { currentDivination, currentQuestion, shuffleCards } = useDivinationStore();

  useEffect(() => {
    if (!currentDivination) {
      navigate('/question');
    }
  }, [currentDivination, navigate]);

  const handleConfirm = async () => {
    await shuffleCards();
    navigate('/draw-cards');
  };

  if (!currentDivination) {
    return null;
  }

  const spreadPositions = JSON.parse(currentDivination.spread.positions as any);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button
        onClick={() => navigate('/question')}
        className="btn-wireframe mb-4"
      >
        [← 返回]
      </button>
      
      <div className="wireframe-card mb-4">
        <h1>问题分析与牌阵推荐</h1>
        
        <div className="border-2 border-black p-4 mb-4">
          <p><strong>您的问题：</strong></p>
          <p>{currentQuestion}</p>
        </div>
        
        <div className="mb-4">
          <h2>问题分析</h2>
          <p>{currentDivination.questionAnalysis}</p>
        </div>
        
        <div className="border-2 border-black p-4 mb-4">
          <h2>推荐牌阵：{currentDivination.spread.name}</h2>
          <p>{currentDivination.spread.description}</p>
          
          <h3 className="mt-4">牌位说明：</h3>
          <ol className="list-decimal list-inside">
            {spreadPositions.map((position: any, index: number) => (
              <li key={index} className="mb-1">
                <strong>{position.name}</strong> - {position.meaning}
              </li>
            ))}
          </ol>
        </div>
        
        <div className="mb-4">
          <h3>推荐理由</h3>
          <p>{currentDivination.spreadRecommendation}</p>
        </div>
        
        <button
          onClick={handleConfirm}
          className="btn-wireframe w-full"
        >
          [确认并开始洗牌]
        </button>
      </div>
    </div>
  );
};

export default SpreadRecommendationPage;