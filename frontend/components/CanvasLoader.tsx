import { Html, useProgress } from '@react-three/drei';

const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html
      as="div"
      center
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <span className="w-16 h-16 border-4 border-t-4 rounded-full animate-spin text-black"></span>
      <p className="text-[#4D4D4D] font-bold text-lg mt-4">
        {progress !== 0 ? `${progress.toFixed(2)}%` : 'Loading...'}
      </p>
    </Html>
  );
};

export default CanvasLoader;
