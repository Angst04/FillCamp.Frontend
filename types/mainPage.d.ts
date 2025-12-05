declare global {
  interface MainPageProps {
    news: NewsPost[];
  }

  interface NewsPost {
    title: string;
    description: string;
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
}
export {};
