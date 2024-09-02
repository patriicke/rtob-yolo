/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:8080/";

export default function Home() {
  const [carCount, setCarCount] = useState<string[][]>([]);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    console.log("reached");

    socket.on("received_data", (data: string) => {
      setCarCount(
        data.split(",").map((str: string) => {
          return str.split(":");
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  console.log(carCount);

  return (
    <div className='h-screen w-screen bg-white'>
      <div className='bg-gray-900 py-24 sm:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl lg:max-w-none'>
            <div className='text-center space-y-4'>
              <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
                Real-Time Object Detection YOLO
              </h2>
              <p className='text-lg leading-8 text-gray-300'>
                The real-time object detection algorithm you're using is YOLO
                (You Only Look Once), Powered by CNN (Convolutional Neural
                Network) designed for high-speed and accurate object detection.
              </p>
            </div>
            <dl className='mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4'>
              {carCount.map((d, i) => {
                if (d[1])
                  return (
                    <div className='flex flex-col bg-white/5 p-8' key={i}>
                      <dt className='text-sm font-semibold leading-6 text-gray-300'>
                        {d[0]}
                      </dt>
                      <dd className='order-first text-3xl font-semibold tracking-tight text-white'>
                        {d[1]}
                      </dd>
                    </div>
                  );
              })}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
