import React from 'react';

type PreviewPaneProps = {
  content: string;
};

export default function PreviewPane({ content }: PreviewPaneProps) {
  return (
    <div className="w-full h-48 border p-4 overflow-y-auto whitespace-pre-wrap bg-white">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
