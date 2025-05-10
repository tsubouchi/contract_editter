import React, { useRef } from 'react';

type DropZoneProps = {
  onFileLoaded?: (file: File, content: string) => void;
};

export default function DropZone({ onFileLoaded }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const text = await file.text();
    onFileLoaded?.(file, text);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    onFileLoaded?.(file, text);
  };

  return (
    <div
      className="w-full h-32 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center text-gray-600 cursor-pointer bg-white"
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      onClick={handleClick}
    >
      <p className="pointer-events-none">ここにHTML/Wordファイルをドラッグ&ドロップ<br />またはクリックして選択</p>
      <input
        type="file"
        accept=".html,.docx,text/html,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        hidden
        ref={inputRef}
        onChange={handleChange}
      />
    </div>
  );
}
