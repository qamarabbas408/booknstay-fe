interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  rows?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  label, error, icon, required, rows, className, ...props 
}) => {
  const isTextarea = rows !== undefined;
  
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</div>}
        {isTextarea ? (
          <textarea
            {...(props as any)}
            rows={rows}
            className={`w-full ${icon ? 'pl-12' : 'px-4'} pr-4 py-3 bg-white border-2 rounded-xl outline-none transition-all resize-none ${
              error ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'
            } ${className || ''}`}
          />
        ) : (
          <input
            {...(props as any)}
            className={`w-full ${icon ? 'pl-12' : 'px-4'} pr-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
              error ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'
            } ${className || ''}`}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};