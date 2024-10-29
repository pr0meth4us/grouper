import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function Header() {
  return (
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Lists</CardTitle>
      <CardDescription>Your saved lists and items</CardDescription>
    </CardHeader>
  );
}
