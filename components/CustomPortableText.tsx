import { PortableText, PortableTextBlock } from "@portabletext/react";

export const CustomPortableText = ({ content }: { content: PortableTextBlock[] }) => {
  return (
    <div className="prose max-w-none">
      <PortableText
        value={content}
        components={{
          block: {
            normal: ({ children }) => <span>{children}</span>,
            h1: ({ children }) => <h1 className="text-2xl font-semibold text-gray-900 mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-900 mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-900 mb-2">{children}</h3>
          },
          list: {
            bullet: ({ children }) => <ul className="list-disc pl-5 mb-4 text-base">{children}</ul>,
            number: ({ children }) => <ol className="list-decimal pl-5 mb-4 text-base">{children}</ol>
          },
          marks: {
            strong: ({ children }) => <strong>{children}</strong>,
            em: ({ children }) => <em>{children}</em>,
            underline: ({ children }) => <u>{children}</u>,
            "strike-through": ({ children }) => <s>{children}</s>
          }
        }}
      />
    </div>
  );
};
