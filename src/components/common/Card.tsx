interface CardProps {
  title: React.ReactNode;
  body: React.ReactNode;
  className?: string;
}

export default function Card({ title, body, className = "" }: CardProps) {
  return (
    <div className={className}>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-3xl">{title}</h2>
        <p className="text-2xl">{body}</p>
      </div>
    </div>
  );
}
