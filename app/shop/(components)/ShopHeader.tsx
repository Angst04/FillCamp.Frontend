interface ShopHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export default function ShopHeader({
  title,
  description,
  className = '',
}: ShopHeaderProps) {
  return (
    <div className={className}>
      <h1 className="text-[32px] font-bold text-[#101010] leading-[1.1] mb-1">
        {title}
      </h1>
      <p className="text-base text-[#656565] leading-[1.1]">
        {description}
      </p>
    </div>
  );
}

