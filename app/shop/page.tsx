import { groq } from "next-sanity";
import { ShopPage } from "./ShopPage";
import { Metadata } from "next";
import { client } from "@/sanity/client";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Магазин FillCamp",
  description: "Здесь вы можете купить мерч, уроки или путевки FillCamp"
};

async function getMerchPageData() {
  return await client.fetch(groq`*[_type == "merchPage"][0]{
    "merch": merch[] { 
      title, 
      price,
      image{
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        alt
      }
    }
  }`);
}
async function getLessonsPageData() {
  return await client.fetch(groq`*[_type == "lessonsPage"][0]{
    "lessons": lessons[] { 
      title, 
      description,
      price
    }
  }`);
}

async function getProgrammsPageData() {
  const programmsPages = await client.fetch(groq`*[_type == "programmsPage"]{
    location,
    seasons[] {
      season,
      shifts[] {
        label,
        price
      },
      prepaymentPrice,
      transferPrice,
      bonusWriteOff,
      bonusCashBack,
      programs[] {
        lang,
        description
      }
    }
  }`);

  // Преобразуем вложенную структуру в плоский массив Programm[]
  const programms: Programm[] = [];
  programmsPages.forEach(
    (page: {
      location: string;
      seasons: Array<{
        season: Season;
        shifts: Shift[];
        prepaymentPrice: number;
        transferPrice: number;
        bonusWriteOff: number;
        bonusCashBack: number;
        programs: Array<{ lang: string; description: CustomTextBlock[] }>;
      }>;
    }) => {
      page.seasons.forEach((seasonData) => {
        seasonData.programs.forEach((program) => {
          programms.push({
            season: seasonData.season,
            location: page.location,
            lang: program.lang,
            description: program.description,
            shifts: seasonData.shifts,
            prepaymentPrice: seasonData.prepaymentPrice,
            transferPrice: seasonData.transferPrice,
            bonusWriteOff: seasonData.bonusWriteOff,
            bonusCashBack: seasonData.bonusCashBack
          });
        });
      });
    }
  );

  return { programms };
}
async function getData() {
  const merch = await getMerchPageData();
  const lessons = await getLessonsPageData();
  const programms = await getProgrammsPageData();
  return { merch, lessons, programms };
}
export default async function Page() {
  const { merch, lessons, programms } = await getData();
  return <ShopPage merch={merch.merch} lessons={lessons.lessons} programms={programms.programms} />;
}
