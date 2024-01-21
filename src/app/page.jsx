"use client"
import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import ButtonHandler from "@/components/btn-handler";
import { detect, detectVideo } from "@/utils/detect";
import "@/style/App.css";
import Loader from "@/components/loader";
import { Pacifico } from 'next/font/google'
import Image from 'next/image'

const pacifico = Pacifico({subsets:['latin'], weight: '400'});

export default function Home() {
  const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
  const [model, setModel] = useState({
    net: null,
    inputShape: [1, 0, 0, 3],
  }); // init model & input shape
  
  const [isVisible, setIsVisible] = useState(true);

  // references
  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // model configs
  const modelName = "best";

  useEffect(() => {
    tf.ready().then(async () => {
      const yolov8 = await tf.loadGraphModel(
        `${window.location.href}/${modelName}_web_model/model.json`,
        {
          onProgress: (fractions) => {
            setLoading({ loading: true, progress: fractions }); // set loading fractions
          },
        }
      ); // load model

      // warming up model
      const dummyInput = tf.ones(yolov8.inputs[0].shape);
      const warmupResults = yolov8.execute(dummyInput);

      setLoading({ loading: false, progress: 1 });
      setModel({
        net: yolov8,
        inputShape: yolov8.inputs[0].shape,
      }); // set model & input shape

      tf.dispose([warmupResults, dummyInput]); // cleanup memory
    });
  }, []);

  const toggleContentVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="lg:flex">
        <div className="App">
      {loading.loading && <Loader>Loading model... {(loading.progress * 100).toFixed(2)}%</Loader>}
      <div className="header p-4">
        <h1 className={`${pacifico.className} text-7xl py-11`}>✌️🤘🤙 Hand Gesture Detection App 👌🤌🫵</h1>
        <p className="text-lg">
          <code className="code">Final Project Deep Learning | Oleh Abimanyu, Naufal, Yuwan</code>
        </p>
      </div>
      
      {isVisible && (
        <div className="bg-[#6551F9] h-[500px] w-[720px] rounded-lg relative flex overflow-hidden items-center justify-center">
          <div className="rounded-lg">
            <Image  src='/banner.png' alt="banner" width={720} height={500} />
          </div>
        </div>
      )}
      

      <div className="content">
        <img
          src="#"
          ref={imageRef}
          onLoad={() => detect(imageRef.current, model, canvasRef.current)}
        />
        <video
          autoPlay
          muted
          ref={cameraRef}
          onPlay={() => detectVideo(cameraRef.current, model, canvasRef.current)}
        />
        <video
          autoPlay
          muted
          ref={videoRef}
          onPlay={() => detectVideo(videoRef.current, model, canvasRef.current)}
        />
        <canvas width={model.inputShape[1]} height={model.inputShape[2]} ref={canvasRef} />
      </div>

      <ButtonHandler imageRef={imageRef} cameraRef={cameraRef} videoRef={videoRef} toggleContentVisibility={toggleContentVisibility}/>
    </div>
      </div>
    </main>
  );
}
