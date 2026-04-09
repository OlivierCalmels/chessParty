import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-(--color-primary) text-white hover:bg-(--color-primary-hover) focus-visible:outline-(--color-primary)',
  secondary: 'bg-(--color-surface-alt) text-(--color-text) hover:bg-(--color-border) focus-visible:outline-(--color-border)',
  danger: 'bg-(--color-danger) text-white hover:bg-(--color-danger-hover) focus-visible:outline-(--color-danger)',
  ghost: 'text-(--color-text-muted) hover:bg-(--color-surface-alt) hover:text-(--color-text)',
};

export function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
