import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivinationStore } from '../services/store';
import type { DrawnCard } from '../types';

const CardDrawingPage = () => {
  const navigate = useNavigate();
  const { 
    currentDivination, 
    shuffledCards, 
    drawCards: submitDrawnCards,
    shuffleCards,
    isLoading 
  } = useDivinationStore();
  
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(true);
  const [cardPositions, setCardPositions] = useState<string[]>([]);

  useEffect(() => {
    if (!currentDivination) {
      navigate('/question');
      return;
    }
    
    const positions = JSON.parse(currentDivination.spread.positions as any);
    setCardPositions(positions.map((p: any) => p.name));
    
    // 洗牌获取卡牌数据
    shuffleCards().then(() => {
      setTimeout(() => {
        setIsShuffling(false);
      }, 1000);
    });
  }, [currentDivination, navigate, shuffleCards]);

  const handleCardSelect = (cardId: number) => {
    if (!currentDivination || selectedCards.length >= currentDivination.spread.cardCount) {
      return;
    }
    
    if (selectedCards.some(c => c.cardId === cardId)) {
      return;
    }
    
    const newCard: DrawnCard = {
      cardId,
      position: cardPositions[selectedCards.length],
      isReversed: Math.random() > 0.5
    };
    
    setSelectedCards([...selectedCards, newCard]);
  };

  const handleConfirmSelection = async () => {
    if (selectedCards.length !== currentDivination?.spread.cardCount) {
      return;
    }
    
    try {
      await submitDrawnCards(selectedCards);
      setTimeout(() => {
        navigate('/result');
      }, 100);
    } catch (error) {
      console.error('Error submitting cards:', error);
      alert('抽牌失败，请重试');
    }
  };

  const handleReset = () => {
    setSelectedCards([]);
  };

  if (!currentDivination) {
    return null;
  }

  const remainingCards = currentDivination.spread.cardCount - selectedCards.length;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <button
        onClick={() => navigate('/spread-recommendation')}
        className="btn-wireframe mb-4"
      >
        [← 返回]
      </button>
      
      <div className="wireframe-card mb-4">
        <h1>洗牌与抽牌</h1>
        <p>请选择 {currentDivination.spread.cardCount} 张牌</p>
      </div>
      
      {selectedCards.length > 0 && (
        <div className="wireframe-card mb-4">
          <h2>已选择的牌 ({selectedCards.length}/{currentDivination.spread.cardCount})</h2>
          <div className="flex gap-2 flex-wrap mt-2">
            {selectedCards.map((card, index) => (
              <div key={index} className="text-center">
                <div className="wireframe-tarot-card wireframe-tarot-card-selected">
                  #{index + 1}
                  <br />
                  {card.isReversed ? '逆' : '正'}
                </div>
                <p className="text-xs mt-1">{card.position}</p>
              </div>
            ))}
          </div>
          
          {remainingCards > 0 && (
            <p className="mt-2">还需选择 {remainingCards} 张牌</p>
          )}
        </div>
      )}
      
      {isShuffling ? (
        <div className="text-center py-10">
          <p className="text-xl">[洗牌中...]</p>
        </div>
      ) : (
        <>
          <div className="wireframe-card">
            <p className="mb-4">点击下方卡牌进行选择：</p>
            <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
              {shuffledCards.slice(0, 78).map((card, index) => {
                const isSelected = selectedCards.some(c => c.cardId === card.id);
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardSelect(card.id)}
                    disabled={isSelected || selectedCards.length >= currentDivination.spread.cardCount}
                    className={`wireframe-tarot-card ${
                      isSelected ? 'wireframe-tarot-card-selected' : ''
                    } ${selectedCards.length >= currentDivination.spread.cardCount && !isSelected ? 'opacity-30' : ''}`}
                  >
                    {isSelected ? '✓' : index + 1}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4 flex gap-4">
            {selectedCards.length > 0 && (
              <button
                onClick={handleReset}
                className="btn-wireframe"
              >
                [重新选择]
              </button>
            )}
            
            {selectedCards.length === currentDivination.spread.cardCount && (
              <button
                onClick={handleConfirmSelection}
                disabled={isLoading}
                className="btn-wireframe"
              >
                {isLoading ? '[处理中...]' : '[确认选择]'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CardDrawingPage;