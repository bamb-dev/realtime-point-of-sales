import { id } from "zod/v4/locales";
import DetailOrder from "./_components/detail-order";

export const metadata = {
  title: "Rony Cafe | DetailOrder Management",
};

export default async function DetailOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DetailOrder id={id} />;
}
