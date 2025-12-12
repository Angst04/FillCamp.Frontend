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

  type PostOrdersRequestItem = {
    item?: number;
    quantity: number;
    programm?: {
      season: Season;
      place: string;
      lang: string;
      description: string;
      shifts: Shift;
      prepaymentPrice: number;
      transferPrice: number;
    };
    merch?: {
      title: string;
      price: number;
      image: string;
    };
    lesson?: {
      title: string;
      description: string;
      price: number;
    };
  };

  type PostOrdersRequest = {
    items: PostOrdersRequestItem[];
    pay_with_bonus: boolean;
    price: number;
    bonuses: number;
  };

  type PostOrdersResponse = {
    id: number;
    items: {
      item_id: number;
      quantity: number;
    }[];
    total_bonus: number;
    total_money: number | null;
    status: string;
  };
}
export {};
