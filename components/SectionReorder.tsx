import React, { useState, useRef } from 'react';
import { DragIcon, CloseIcon } from './icons';

interface SectionReorderProps {
  sections: string[];
  onOrderChange: (newOrder: string[]) => void;
  onClose: () => void;
}

const SectionReorder: React.FC<SectionReorderProps> = ({ sections, onOrderChange, onClose }) => {
  const [list, setList] = useState(sections);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    e.currentTarget.classList.add('opacity-50', 'bg-zinc-800');
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
    const listCopy = [...list];
    const dragItemContent = listCopy[dragItem.current!];
    listCopy.splice(dragItem.current!, 1);
    listCopy.splice(dragOverItem.current!, 0, dragItemContent);
    dragItem.current = dragOverItem.current;
    dragOverItem.current = null;
    setList(listCopy);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50', 'bg-zinc-800');
  };

  const handleSave = () => {
    onOrderChange(list);
    onClose();
  };
  
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Reorder Sections</h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-white"><CloseIcon className="text-[20px]"/></button>
        </div>
        
        <div className="space-y-2 mb-8">
          {list.map((section, index) => (
            <div
              key={section}
              className="flex items-center justify-between bg-input border border-border p-3 rounded-md cursor-grab active:cursor-grabbing hover:border-zinc-600 transition-colors group"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <span className="text-sm font-medium text-zinc-200">{capitalize(section)}</span>
              <DragIcon className="text-[18px] text-zinc-600 group-hover:text-zinc-400" />
            </div>
          ))}
        </div>
        
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2.5 rounded-md transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 bg-white hover:bg-zinc-200 text-black text-sm font-medium py-2.5 rounded-md transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionReorder;