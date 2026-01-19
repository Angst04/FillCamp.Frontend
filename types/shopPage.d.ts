declare global {
  type Season = "ЛЕТО" | "ОСЕНЬ" | "ЗИМА" | "ВЕСНА";
  type Category = "merch" | "lessons" | "programms";

  interface Shift {
    label: string;
    price: number;
  }

  interface Programm {
    season: Season;
    location: string;
    lang: string;
    description: CustomTextBlock[];
    shifts: Shift[];
    prepaymentPrice: number;
    transferPrice: number;
    bonusWriteOff: number;
    bonusWriteOffPercent?: number;
    bonusCashBack: number;
    bonusCashBackPercent?: number;
    image: SanityImage;
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
    cashback?: number;
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
    payment_url: string | null;
    payment_id: string | null;
  };
}
export { };
