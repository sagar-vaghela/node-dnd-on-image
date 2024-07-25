import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { Rnd } from 'react-rnd';

const ResponsiveImageWithPins = ({ src, initialPins, onSave }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const [pins, setPins] = useState(initialPins);

//   useEffect(() => {
//     setPins(initialPins);
//   }, [initialPins]);

  useEffect(() => {
    const savedPins = localStorage.getItem('pins');
    const savedDimensions = localStorage.getItem('dimensions');
    if (savedPins && savedDimensions) {
      setPins(JSON.parse(savedPins));
      setDimensions(JSON.parse(savedDimensions));
    } else {
      if (containerRef.current) {
        const { offsetWidth: newWidth, offsetHeight: newHeight } = containerRef.current;
        setDimensions({ width: newWidth, height: newHeight });
      }
    }

    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth: newWidth, offsetHeight: newHeight } = containerRef.current;
        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [containerRef]);

  const handleDragStop = (e, d, index) => {
    const newPins = [...pins];
    newPins[index] = {
      ...newPins[index],
      x: (d.x / dimensions.width) * 100,
      y: (d.y / dimensions.height) * 100,
    };
    setPins(newPins);
    localStorage.setItem('pins', JSON.stringify(newPins));
  };

  const handleResizeStop = (e, direction, ref, delta, position, index) => {
    const newPins = [...pins];
    newPins[index] = {
      ...newPins[index],
      x: (position.x / dimensions.width) * 100,
      y: (position.y / dimensions.height) * 100,
      width: (ref.offsetWidth / dimensions.width) * 100,
      height: (ref.offsetHeight / dimensions.height) * 100,
    };
    setPins(newPins);
    localStorage.setItem('pins', JSON.stringify(newPins));
  };

  const addNewPin = () => {
    const newPin = { id: pins.length + 1, x: 0, y: 0, width: 5, height: 5 };
    const newPins = [...pins, newPin];
    setPins(newPins);
    localStorage.setItem('pins', JSON.stringify(newPins));
  };

  const savePins = () => {
    onSave(pins);
    localStorage.setItem('pins', JSON.stringify(pins));
    localStorage.setItem('dimensions', JSON.stringify(dimensions));
  };

  return (
    <div className="relative w-full flex">
      <div ref={containerRef} className="relative w-full">
        <Image src={src} layout="responsive" width={1000} height={600} objectFit="cover" className="w-full h-auto" />
        {pins.map((pin, index) => (
          <Rnd
            key={index}
            position={{
              x: (pin.x / 100) * dimensions.width,
              y: (pin.y / 100) * dimensions.height,
            }}
            size={{
              width: (pin.width / 100) * dimensions.width,
              height: (pin.height / 100) * dimensions.height,
            }}
            onDragStop={(e, d) => handleDragStop(e, d, index)}
            onResizeStop={(e, direction, ref, delta, position) => handleResizeStop(e, direction, ref, delta, position, index)}
            bounds="parent"
            className="absolute"
          >
            <div className="w-full h-full bg-red-500"></div>
          </Rnd>
        ))}
        <button onClick={savePins} className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </div>
  );
};

export default ResponsiveImageWithPins;
