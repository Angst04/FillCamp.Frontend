declare global {
  interface MainPageProps {
    news: NewsPost[];
  }

  interface NewsPost {
    title: string;
    description: CustomTextBlock[];
    image: SanityImage;
    date: string;
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
