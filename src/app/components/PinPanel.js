import { useDrag } from "react-dnd";

const PinPanel = ({ onAddPin }) => {
    const DraggablePin = ({ id }) => {
        const [, drag] = useDrag(() => ({
          type: 'PIN',
          item: { id },
        }));
      
        return (
          <div ref={drag} className="w-12 h-12 bg-blue-500 rounded-full mb-2 cursor-pointer">
            Pin {id}
          </div>
        );
      };

    return (
      <div className="w-40 p-4 bg-gray-200">
        <h2 className="text-xl font-bold mb-4">Pins</h2>
        <button
          onClick={onAddPin}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded mb-2"
        >
          Add New Pin
        </button>
        <DraggablePin key={1} id={1} />
      </div>
    );
  };
  
  export default PinPanel;
  