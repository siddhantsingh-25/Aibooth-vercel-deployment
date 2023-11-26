import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { useForm } from 'react-hook-form';
import { FaCamera } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { storage } from '../../pages/api/firebaseConfig'; // Adjust path as needed
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const AiBoothComponent: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setImage(imageSrc || '');
  };

  const uploadImage = async () => {
    if (!image) return;

    try {
      setLoading(true);
      const fetchResponse = await fetch(image);
      const blob = await fetchResponse.blob();
      const imageFile = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
      const imageRef = storageRef(storage, `images/${imageFile.name}`);
      const uploadResult = await uploadBytes(imageRef, imageFile);
      const url = await getDownloadURL(uploadResult.ref);
      setImageUrl(url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const onSubmit = async (data: { prompt: string }) => {
    if (!imageUrl) return;

    try {
      const response = await fetch('/api/imageProcess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl, prompt: data.prompt }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      const processedImageUrl = responseData.output.output_images[0];
      setLoading(false);
      router.push(`/displayImage?imageUrl=${encodeURIComponent(processedImageUrl)}`);
    } catch (error) {
      console.error('There was a problem with the operation:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center rounded-3xl">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-xl"
      />
      <button onClick={capture} className="glassmorphism text-white font-bold py-4 px-6 rounded mt-4">
        <FaCamera size="24px" /> Capture Photo
      </button>
      {image && (
        <>
          <img src={image} alt="Captured" className="mt-4 rounded-lg shadow-xl" />
          <button 
            onClick={uploadImage} 
            className="glassmorphism text-white font-bold py-2 px-4 rounded mt-3"
            disabled={loading}
          >
            Confirm
          </button>
        </>
      )}
      {imageUrl && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 w-full max-w-xs">
          <input 
            {...register('prompt', { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your prompt"
            disabled={loading}
          />
          {errors.prompt && <span className="text-red-500 text-xs italic">This field is required</span>}
          <input 
            type="submit" 
            className="glassmorphism text-white font-bold py-2 px-4 rounded mt-3 w-full"
            disabled={loading}
          />
        </form>
      )}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default AiBoothComponent;
