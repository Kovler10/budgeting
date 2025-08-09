import { ExpenseDashboard } from "@/components/expense-dashboard";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <ExpenseDashboard />
    </div>
  );
}
