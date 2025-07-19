import { type JSX } from "react";

interface CardProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}

export const Card = ({
  className,
  title,
  children,
  href,
}: CardProps): JSX.Element => {
  return (
    <a
      className={className}
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2 className="text-2xl text-yellow font-bold mb-4">
        {title} <span>-&gt;</span>
      </h2>
      <p>{children}</p>
    </a>
  );
};
