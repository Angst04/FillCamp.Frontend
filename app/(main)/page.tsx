import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import { MainPage } from "./MainPage";
import { Metadata } from "next";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Новости FillCamp",
  description: "Новости FillCamp"
};

async function getNewsPageData() {
  return await client.fetch(groq`*[_type == "newsPage"][0]{
    title, 
    "news": news[] { 
      title, 
      description, 
      date,
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

export default async function Page() {
  try {
    const newsPageData = await getNewsPageData();
    console.log(newsPageData.news);
    return <MainPage news={newsPageData.news} />;
  } catch (error) {
    console.error(error);
    return <div className="text-red-500 text-center text-2xl font-bold">Error loading news</div>;
  }
}
