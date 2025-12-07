declare global {
  interface SanityImage {
    asset: {
      _id: string;
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
          aspectRatio: number;
        };
      };
    };
    alt: string;
  }

  type CustomTextBlock = PortableTextBlock<
    PortableTextMarkDefinition,
    ArbitraryTypedObject | PortableTextSpan,
    string,
    string
  >;
}
export {};
