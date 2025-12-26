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
  const newsPageData = await getNewsPageData();
  return (
    <AuthGuard>
      <MainPage news={newsPageData.news} />
    </AuthGuard>
  );
}
