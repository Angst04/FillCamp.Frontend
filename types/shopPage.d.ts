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

  type PostOrdersRequest = {
    items: {
      item: string;
      quantity: number;
    }[];
    pay_with_bonus: boolean;
    price: number;
    bonuses: number;
  };
  type PostOrdersResponse = {
    id: string;
    items: {
      item: string;
      quantity: number;
    }[];
    total_bonus: number;
    total_money: number;
    status: string;
  };
}
export {};
