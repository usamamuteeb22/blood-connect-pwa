
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

const fields = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone" },
];

const DonorSearchFilters = ({
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery
}: {
  searchQuery: { field: string; value: string };
  setSearchQuery: (q: { field: string; value: string }) => void;
  locationQuery: { city: string, address: string };
  setLocationQuery: (q: { city: string, address: string }) => void;
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Multi-field */}
      <div className="flex gap-2 w-full md:w-2/5">
        <select
          className="border px-2 rounded-md text-sm"
          value={searchQuery.field}
          onChange={(e) => setSearchQuery({ ...searchQuery, field: e.target.value })}
        >
          <option value="">Search Field</option>
          {fields.map(f => (
            <option value={f.key} key={f.key}>{f.label}</option>
          ))}
        </select>
        <Input
          placeholder="Enter search value"
          value={searchQuery.value}
          onChange={(e) => setSearchQuery({ ...searchQuery, value: e.target.value })}
        />
      </div>
      {/* Location-based: City, Address */}
      <Input
        className="w-full md:w-1/4"
        placeholder="City"
        value={locationQuery.city}
        onChange={e => setLocationQuery({ ...locationQuery, city: e.target.value })}
      />
      <Input
        className="w-full md:w-1/3"
        placeholder="Address"
        value={locationQuery.address}
        onChange={e => setLocationQuery({ ...locationQuery, address: e.target.value })}
      />
    </div>
  );
};

export default DonorSearchFilters;
