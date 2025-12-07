declare global {
  type Season = "ЛЕТО" | "ОСЕНЬ" | "ЗИМА" | "ВЕСНА";
  type Category = "merch" | "lessons" | "programms";

  interface Shift {
    label: string;
    price: number;
  }

  interface Programm {
    season: Season;
    place: string;
    lang: string;
    description: CustomTextBlock[];
    shifts: Shift[];
    prepaymentPrice: number;
    transferPrice: number;
  }

  interface Merch {
    title: string;
    price: number;
    image: SanityImage;
  }

  interface Lesson {
    title: string;
    description: string;
    price: number;
  }

  interface ShopPageProps {
    merch: Merch[];
    lessons: Lesson[];
    programms: Programm[];
  }
}
export {};
