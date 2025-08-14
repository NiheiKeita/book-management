import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreviewComponent: React.FC<MarkdownPreviewProps> = ({
  content,
  className = '',
}) => {
  if (!content || content.trim() === '') {
    return (
      <div className={`text-gray-500 italic ${className}`}>
        メモがありません
      </div>
    );
  }

  return (
    <div className={`markdown-preview ${className}`}>
      <MarkdownPreview
        source={content}
        style={{
          backgroundColor: 'transparent',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
        data-color-mode="light"
      />
    </div>
  );
};

export default MarkdownPreviewComponent;