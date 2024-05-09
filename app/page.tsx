import { getFrameMetadata } from "frog/next";
import type { Metadata } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";

import styles from "./page.module.css";
import { useEffect } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `https://frame-with-zora-mint-comment.vercel.app/api`
  );
  return {
    other: frameTags,
  };
}

export default function Home() {
  // redirect("https://song.camp/");
  return <p>awaiting redirect</p>;
}
