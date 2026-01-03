interface CardProps {
  title: React.ReactNode;
  body: React.ReactNode;
  className?: string;
  cardBodyClassName?: string;
  titleClassName?: string;
  bodyClassName?: string;
}

export default function Card({
  title,
  body,
  className = "",
  cardBodyClassName = "card-body",
  titleClassName = "card-title",
  bodyClassName = "",
}: CardProps) {
  return (
    <div className={className}>
      <div className={cardBodyClassName}>
        <h2 className={titleClassName}>{title}</h2>
        <p className={bodyClassName}>{body}</p>
      </div>
    </div>
  );
}
