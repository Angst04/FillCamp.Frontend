import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import { MainPage } from "./MainPage";
import { Metadata } from "next";
import { AuthGuard } from "@/components/AuthGuard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Новости FillCamp",
  description: "Новости FillCamp"
};

async function getNewsPageData() {
  return await client.fetch(groq`*[_type == "newsPage"][0]{
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
    return (
      <AuthGuard>
        <MainPage news={newsPageData.news} />
      </AuthGuard>
    );
  } catch (error) {
    console.error(error);
    return <div className="text-red-500 text-center text-2xl font-bold">Не удалось загрузить новости</div>;
  }
}
