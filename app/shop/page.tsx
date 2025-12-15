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
  return await client.fetch(groq`*[_type == "programmsPage"][0]{
    "programms": programms[] { 
      season,
      place,
      lang,
      description,
      shifts[] {
        label,
        price
      },
      prepaymentPrice,
      transferPrice,
      bonusWriteOff,
      bonusCashBack,
    }
  }`);
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
