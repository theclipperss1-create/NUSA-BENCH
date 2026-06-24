import ReactionTest from '../components/games/ReactionTest';
import AimTest from '../components/games/AimTest';
import NumberTest from '../components/games/NumberTest';
import SequenceTest from '../components/games/SequenceTest';
import VisualTest from '../components/games/VisualTest';
import VerbalTest from '../components/games/VerbalTest';
import WawasanTest from '../components/games/WawasanTest';
import FunModes from '../components/games/FunModes';

export default function PlayGame({ gameId, setCurrentView }) {
  const handleBack = () => {
    setCurrentView('landing');
  };

  switch (gameId) {
    case 'reaction':
      return <ReactionTest onBack={handleBack} />;
    case 'aimTrainer':
      return <AimTest onBack={handleBack} />;
    case 'numberMemory':
      return <NumberTest onBack={handleBack} />;
    case 'sequenceMemory':
      return <SequenceTest onBack={handleBack} />;
    case 'visualMemory':
      return <VisualTest onBack={handleBack} />;
    case 'verbalMemory':
      return <VerbalTest onBack={handleBack} />;
    case 'wawasanIndonesia':
      return <WawasanTest onBack={handleBack} />;
    case 'funModes':
      return <FunModes onBack={handleBack} />;
    default:
      return (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h3>Uji Coba Tidak Ditemukan</h3>
          <button onClick={handleBack} className="btn btn-primary" style={{ marginTop: '20px' }}>
            Kembali ke Beranda
          </button>
        </div>
      );
  }
}
