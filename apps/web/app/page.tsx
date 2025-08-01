import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data } = await supabase.from("DATA").select("*");

  return (
    <ul>
      {data?.map((item: any, index: number) => (
        <li key={`${item.type}-${index}`} className="text-white">
          {JSON.stringify(item)}
        </li>
      ))}
    </ul>
  );
}
