type InputFieldProps = {
    label: string
    id: string
    placeholder: string
    value: string
    onChange: (value: string) => void
    type?: string
    autoComplete?: string
    error?: string
  }
  
  export function InputField({
    label,
    id,
    placeholder,
    value,
    onChange,
    type = 'text',
    autoComplete,
  }: InputFieldProps) {
    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={id}
          className="text-[13px] font-medium text-[#263b37]"
        >
          {label}
        </label>
  
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="h-12 w-full rounded-[10px] border border-[#d8e1df] bg-white px-4 text-[14px] text-[#263b37] outline-none transition placeholder:text-[#9aa9a6] focus:border-[#0b5c55] focus:ring-2 focus:ring-[#0b5c55]/10"
        />
      </div>
    )
  }
  
  
  
  