import { ReactNode } from "react";

interface ButtonProps {
  appName: string;
  className?: string;
  children: ReactNode;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
