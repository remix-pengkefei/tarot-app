import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivinationStore } from '../services/store';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const QuestionPage = () => {
  const navigate = useNavigate();
  const { setQuestion, startDivination, isLoading, error } = useDivinationStore();
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();
  
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (transcript) {
      setInputValue(prev => prev + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setQuestion(inputValue);
    
    try {
      await startDivination(inputValue);
      navigate('/spread-recommendation');
    } catch (err) {
      console.error('Failed to start divination:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <button
        onClick={() => navigate('/')}
        className="btn-wireframe mb-4"
      >
        [← 返回]
      </button>
      
      <div className="wireframe-card">
        <h1>输入您的问题</h1>
        
        <p>请输入您想要占卜的问题（至少5个字符）：</p>
        
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="在此输入问题..."
          className="wireframe-input h-32 my-4"
          maxLength={500}
        />
        
        <div className="flex justify-between items-center mb-4">
          <span>{inputValue.length}/500</span>
          {isSupported && (
            <button
              onClick={handleVoiceInput}
              className="btn-wireframe"
            >
              {isListening ? '[停止录音]' : '[语音输入]'}
            </button>
          )}
        </div>
        
        {error && (
          <p className="text-red-600 mb-4">错误: {error}</p>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isProcessing || isLoading}
          className="btn-wireframe w-full"
        >
          {isProcessing || isLoading ? '[处理中...]' : '[下一步]'}
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;