import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface GroupSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const GroupSearch = ({ searchQuery, setSearchQuery }: GroupSearchProps) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search groups..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};