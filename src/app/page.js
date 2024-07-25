'use client'
import { useState } from 'react';
import ResponsiveImageWithPins from './components/ResponsiveImageWithPins';
import PinPanel from './components/PinPanel';
import DndContext from './components/dndContext';

const initialPins = [
  { x: 20, y: 30 },
  { x: 50, y: 50 },
  { x: 80, y: 70 },
];

export default function Home() {
  const [pins, setPins] = useState(initialPins);

  const handleSave = (newPins) => {
    setPins(newPins);
    console.log('Saved pins:', newPins);
  };

  const onPinAdd = () => {
    const oldPins = localStorage.getItem('pins');
    const newPins = oldPins ? JSON.parse(oldPins) : [];
    newPins.push({ x: 0, y: 0, width: 10, height: 10, dropped: true });
    localStorage.setItem('pins', JSON.stringify(newPins));
    setPins(newPins);
  }


  return (
    <DndContext>
      <div>
        <h1 className="text-3xl font-bold mb-4">Responsive Image with Pins</h1>
        <div className="flex">
          <ResponsiveImageWithPins src="/warehouse.png" initialPins={pins} onSave={handleSave} />
          <PinPanel onAddPin={onPinAdd} />
        </div>
      </div>
    </DndContext>
  );
}
