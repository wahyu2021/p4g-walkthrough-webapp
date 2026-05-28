import type { Entry } from '../../types/walkthrough';

interface ActivityEntryProps {
  entry: Entry;
}

export function ActivityEntry({ entry }: ActivityEntryProps) {
  const { type, title, content } = entry;

  // Define colors based on entry type
  const getTypeStyles = () => {
    switch (type.toLowerCase()) {
      case 'story':
        return 'border-l-4 border-blue-500 bg-blue-500/10';
      case 'social':
        return 'border-l-4 border-pink-500 bg-pink-500/10';
      case 'activity':
        return 'border-l-4 border-green-500 bg-green-500/10';
      case 'info':
      default:
        return 'border-l-4 border-p4-yellow bg-p4-yellow/10';
    }
  };

  return (
    <div className={`p-3 mb-2 rounded-r-md ${getTypeStyles()}`}>
      <h4 className="font-bold text-p4-yellow uppercase text-xs tracking-wider mb-1">
        {title}
      </h4>
      <p className="text-sm text-gray-200 leading-relaxed">
        {content}
      </p>
    </div>
  );
}
