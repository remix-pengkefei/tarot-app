import { useNavigate } from 'react-router-dom';
import { useDivinationStore } from '../services/store';

const HomePage = () => {
  const navigate = useNavigate();
  const reset = useDivinationStore((state) => state.reset);

  const handleStartDivination = () => {
    reset();
    navigate('/question');
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="wireframe-card text-center">
        <h1>塔罗占卜</h1>
        <p>点击下方按钮开始占卜</p>
        <br />
        <button
          onClick={handleStartDivination}
          className="btn-wireframe"
        >
          [开始占卜]
        </button>
      </div>
    </div>
  );
};

export default HomePage;