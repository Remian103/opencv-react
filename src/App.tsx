import React, {ChangeEvent, useCallback, useRef, useState} from 'react';
import './App.css';
import cv from 'opencv-ts';

function App() {
  const [loading, setLoading] = useState(false);

  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const convertMosaic = useCallback((srcCanvas: HTMLCanvasElement, dstCanvas: HTMLCanvasElement) => {
    let src = cv.imread(srcCanvas);
    let dst = new cv.Mat();

    let srcSize = new cv.Size(src.rows, src.cols);
    let dstSize = new cv.Size(32, 32);

    cv.resize(src, dst, dstSize, 0, 0, cv.INTER_AREA);
    cv.resize(dst, dst, srcSize, 0, 0, cv.INTER_AREA);
    cv.imshow(dstCanvas, dst);

    src.delete();
    dst.delete();
  }, []);

  const handleConvert = useCallback(() => {
    if(!sourceCanvasRef.current || !resultCanvasRef.current) {
      return;
    }

    setLoading(true);
    convertMosaic(sourceCanvasRef.current, resultCanvasRef.current);
    setLoading(false);
  }, [convertMosaic])


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
      <button onClick={handleConvert} disabled={loading}>변환</button>
      <canvas ref={resultCanvasRef} id="canvasOutput" />
    </div>
  );
}

export default App;
