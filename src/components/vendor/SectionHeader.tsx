import React from 'react';
import { Plus } from 'lucide-react';

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  gradientFrom?: string;
  gradientTo?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  description,
  buttonText,
  onButtonClick,
  gradientFrom = 'from-purple-600',
  gradientTo = 'to-pink-600',
}) => {
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-tr-4xl p-6`}>
      <div className="flex items-center space-x-3">
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-display text-white">
            {title}
          </h2>
          <p className="text-white/80 text-sm">{description}</p>
        </div>
      </div>
      <button
        onClick={onButtonClick}
        className="px-5 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
      >
        <Plus size={18} />
        {buttonText}
      </button>
    </div>
  );
};

export default SectionHeader;
