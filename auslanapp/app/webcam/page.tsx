import { WebcamCapture } from '@/components/webcam-capture';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Sign Language Detection</h1>
      <WebcamCapture />
    </main>
  );
}
