import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Rnd } from 'react-rnd';

const ResponsiveImageWithPins = ({ src, initialPins, onSave }) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [containerRef, setContainerRef] = useState(null);
    const [pins, setPins] = useState(initialPins);
    // const [color, setColor] = useState('#FFFBB2');

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: 'PIN',
        drop: (item, monitor) => {
            console.log('item', item);
            console.log('monitor', monitor);
          const delta = monitor.getClientOffset();
          console.log('delta', delta);
          const x = (delta.x - containerRef.offsetLeft) / dimensions.width * 100;
          const y = (delta.y - containerRef.offsetTop) / dimensions.height * 100;
          console.log('x', x, 'y', y);
          setPins([...pins, { id: item.id, x, y, width: 5, height: 5 }]);
          localStorage.setItem('pins', JSON.stringify([...pins, { id: item.id, x, y, width: 5, height: 5 }]));
        },
        collect: (monitor) => ({
          canDrop: monitor.canDrop(),
          isOver: monitor.isOver(),
        }),
      });

      useEffect(() => {
    setPins(initialPins);
  }, [initialPins]);

    useEffect(() => {
        const savedPins = localStorage.getItem('pins');
        const savedDimensions = localStorage.getItem('dimensions');
        if (savedPins && savedDimensions) {
            setPins(JSON.parse(savedPins));
            setDimensions(JSON.parse(savedDimensions));
        } else {
            if (containerRef) {
                const { offsetWidth: newWidth, offsetHeight: newHeight } = containerRef;
                setDimensions({ width: newWidth, height: newHeight });
            }
        }

        const updateDimensions = () => {
            if (containerRef) {
                const { offsetWidth: newWidth, offsetHeight: newHeight } = containerRef;
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
        localStorage.setItem('dimensions', JSON.stringify(dimensions));
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
        localStorage.setItem('dimensions', JSON.stringify(dimensions));
    };

    const savePins = () => {
        onSave(pins);
        localStorage.setItem('pins', JSON.stringify(pins));
        localStorage.setItem('dimensions', JSON.stringify(dimensions));
    };

    const deleteZone = (pin, index) => {
        const newPins = [...pins];
        newPins.splice(index, 1);
        setPins(newPins);
        localStorage.setItem('pins', JSON.stringify(newPins));
        localStorage.setItem('dimensions', JSON.stringify(dimensions));
    };

    const handleColorChange = (e, index) => {
        //store index of the pin and color
        const newPins = [...pins];

        newPins[index] = {
            ...newPins[index],
            color: e.target.value,
        };
        // setColor(e.target.value);
        setPins(newPins);
        localStorage.setItem('pins', JSON.stringify(newPins));
        localStorage.setItem('dimensions', JSON.stringify(dimensions));


    }


    return (
        <div ref={setContainerRef} className="relative w-full" >
            <Image src={src} layout="responsive" width={1000} height={600} objectFit="cover" className="w-full h-auto" ref={drop}/>
            {pins.map((pin, index) => (
                <Rnd
                    key={index}
                    position={{
                        x: (pin.x / 100) * dimensions.width,
                        y: (pin.y / 100) * dimensions.height,
                    }}
                    size={{
                        width: (pin.width / 100) * dimensions.width ?? 50,
                        height: (pin.height / 100) * dimensions.height ?? 50,
                    }}
                    onDragStop={(e, d) => handleDragStop(e, d, index)}
                    onResizeStop={(e, direction, ref, delta, position) => handleResizeStop(e, direction, ref, delta, position, index)}
                    bounds="parent"
                    className="absolute"
                >
                    <p
                        color="primary"
                        style={{
                            fontWeight: 900,
                            fontSize: 14,
                            width: '275px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: 'blue',
                        }}
                    >
                        {' '}
                        {'zone.name'}{' '}
                    </p>
                   
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                    }}>
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: '1px solid #FFFBB2',
                                backgroundColor: 'rgb(255, 251, 178)',
                                opacity: 0.5,
                            }}

                            data-name={'zone.name'}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: ((pin.width / 100) * 20 / 100 * dimensions.width) < 30 ? ((pin.width / 100) * 20 / 100 * dimensions.width) : 30,
                                height: ((pin.width / 100) * 20 / 100 * dimensions.width) < 30 ? ((pin.width / 100) * 20 / 100 * dimensions.width) : 30,
                                backgroundColor: 'red',
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '16px',
                                cursor: 'pointer',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'black',
                                },
                                '& span': {
                                    position: 'relative',
                                    top: '-1px',
                                },
                            }}
                            onClick={() => deleteZone(pin, index)}
                        >
                            <div style={{ fontSize: ((pin.width / 100) * 15 / 100 * dimensions.width) < 10 ? ((pin.width / 100) * 20 / 100 * dimensions.width) : 15 }}>x</div>

                        </div>
                    </div>
                </Rnd>
            ))}
            <button onClick={savePins} className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
                Save
            </button>
        </div>
    );
};

export default ResponsiveImageWithPins;
