interface CardProps {
  title: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  cardBodyClassName?: string;
  titleClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export default function Card({
  title,
  body,
  footer,
  className = "",
  cardBodyClassName = "card-body",
  titleClassName = "card-title",
  bodyClassName = "text-left",
  footerClassName = "card-actions justify-end",
}: CardProps) {
  return (
    <div className={className}>
      <div className={cardBodyClassName}>
        <h2 className={titleClassName}>{title}</h2>
        <div className={bodyClassName}>{body}</div>
        {footer && <div className={footerClassName}>{footer}</div>}
      </div>
    </div>
  );
}
