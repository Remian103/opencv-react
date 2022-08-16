import React, {ChangeEvent, useCallback, useRef, useState} from 'react';
import './App.css';
import {useOpenCV} from './providers/OpenCVProvider';

function App() {
  const {loaded, cv} = useOpenCV();
  const [loading, setLoading] = useState(false);

  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const convertMosaic = useCallback((srcCanvas: HTMLCanvasElement, dstCanvas: HTMLCanvasElement) => {
    if (!cv) {
      return;
    }

    let src = cv.imread(srcCanvas);
    let dst = new cv.Mat();

    let srcSize = new cv.Size(src.rows, src.cols);
    let dstSize = new cv.Size(32, 32);

    cv.resize(src, dst, dstSize, 0, 0, cv.INTER_AREA);
    cv.resize(dst, dst, srcSize, 0, 0, cv.INTER_AREA);
    cv.imshow(dstCanvas, dst);

    src.delete();
    dst.delete();
  }, [cv]);

  const handleConvert = useCallback(() => {
    if(!sourceCanvasRef.current || !resultCanvasRef.current || !loaded) {
      return;
    }

    setLoading(true);
    convertMosaic(sourceCanvasRef.current, resultCanvasRef.current);
    setLoading(false);
  }, [loaded, convertMosaic])


  const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if(!sourceCanvasRef.current) {
      return;
    }
    const file = e.target.files?.[0];
    if(!file) {
      return;
    }

    const canvas = sourceCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
    }
    img.src = url;
  }, []);

  return (
    <div className="App">
      <canvas ref={sourceCanvasRef} id="canvasInput" />
      <input type="file" id="fileInput" name="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleConvert} disabled={!loaded || loading}>변환</button>
      <canvas ref={resultCanvasRef} id="canvasOutput" />
    </div>
  );
}

export default App;
