import { LineCharts } from "@/components/common/line-charts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Dashboard Management</h1>
      </div>
      <Card>
        <CardHeader>Show Chart</CardHeader>
        <div className="h-64">
          <LineCharts />
        </div>
      </Card>
    </div>
  );
}
