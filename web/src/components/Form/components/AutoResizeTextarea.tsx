import {
  FormEvent,
  TextareaHTMLAttributes,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';

type AutoResizeTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const AutoResizeTextarea = ({
  value,
  onInput,
  ...props
}: AutoResizeTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  useLayoutEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <textarea
      {...props}
      ref={textareaRef}
      rows={1}
      value={value}
      onInput={(e: FormEvent<HTMLTextAreaElement>) => {
        resize();
        onInput?.(e);
      }}
    />
  );
};

export default AutoResizeTextarea;