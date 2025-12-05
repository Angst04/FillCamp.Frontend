declare global {
  interface MainPageProps {
    news: NewsPost[];
  }

  type CustomTextBlock = PortableTextBlock<
    PortableTextMarkDefinition,
    ArbitraryTypedObject | PortableTextSpan,
    string,
    string
  >;

  interface NewsPost {
    title: string;
    description: CustomTextBlock[];
    image: SanityImage;
    date: string;
  }

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

  interface NewsCardPopupProps {
    isModalOpen: boolean;
    handleCloseModal: () => void;
    image: SanityImage;
    title: string;
    date: string;
    description: CustomTextBlock[];
  }
}
export {};
