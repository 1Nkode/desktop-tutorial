import { useEffect, useRef } from 'react';
import { FROG_VARIANTS } from './petMeta';

const CLIPS = {
  natural: '/pet/frog-motion/natural.mp4',
  sitting: '/pet/frog-motion/sitting.mp4',
  transform: '/pet/frog-motion/transform.mp4',
};

function pickClip({ pose, state, emotion }) {
  if (state === 'champion' || emotion === 'excited' || emotion === 'surprised') return 'transform';
  if (pose === 'sit' || state === 'tired' || state === 'neglected' || emotion === 'tired' || emotion === 'sad') return 'sitting';
  return 'natural';
}

export default function PetSprite({
  pose = 'stand',
  state = 'base',
  emotion = 'happy',
  variant = 'natural',
}) {
  const clip = pickClip({ pose, state, emotion });
  const style = FROG_VARIANTS[variant] || FROG_VARIANTS.natural;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return undefined;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let raf = 0;
    let stopped = false;
    let running = false;

    function sampleKey(data, width, height) {
      const points = [
        [4, 4],
        [width - 5, 4],
        [4, height - 5],
        [width - 5, height - 5],
      ];
      return points.reduce((acc, [x, y]) => {
        const i = (y * width + x) * 4;
        acc.r += data[i];
        acc.g += data[i + 1];
        acc.b += data[i + 2];
        return acc;
      }, { r: 0, g: 0, b: 0 });
    }

    function render() {
      if (stopped) return;
      if (video.readyState >= 2 && video.videoWidth && video.videoHeight) {
        const width = video.videoWidth;
        const height = video.videoHeight;
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        ctx.drawImage(video, 0, 0, width, height);
        const frame = ctx.getImageData(0, 0, width, height);
        const pixels = frame.data;
        const key = sampleKey(pixels, width, height);
        key.r /= 4;
        key.g /= 4;
        key.b /= 4;

        for (let i = 0; i < pixels.length; i += 4) {
          const dr = pixels[i] - key.r;
          const dg = pixels[i + 1] - key.g;
          const db = pixels[i + 2] - key.b;
          const dist = Math.sqrt(dr * dr + dg * dg + db * db);
          if (dist < 42) {
            pixels[i + 3] = 0;
          } else if (dist < 78) {
            pixels[i + 3] = Math.round(((dist - 42) / 36) * 255);
          }
        }
        ctx.putImageData(frame, 0, 0);
      }
      raf = requestAnimationFrame(render);
    }

    const play = () => {
      video.play?.().catch(() => {});
      if (running) return;
      running = true;
      render();
    };

    video.addEventListener('loadeddata', play);
    video.addEventListener('play', render);
    if (video.readyState >= 2) play();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      video.removeEventListener('loadeddata', play);
      video.removeEventListener('play', render);
    };
  }, [clip]);

  return (
    <div
      className={`petsprite frog-video-sprite frog-video-${clip} frog-variant-${variant}`}
      style={{
        '--frog-filter': style.filter,
        '--frog-glow': style.glow,
      }}
      aria-hidden="true"
    >
      <video
        key={clip}
        ref={videoRef}
        className="frog-video-source"
        src={CLIPS[clip]}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <canvas ref={canvasRef} className="frog-video" />
      <span className="frog-video-floor" />
    </div>
  );
}
