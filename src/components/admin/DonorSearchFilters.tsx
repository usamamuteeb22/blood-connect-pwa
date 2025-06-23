
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface DonorSearchFiltersProps {
  searchQuery: { field: string; value: string };
  setSearchQuery: (q: { field: string; value: string }) => void;
  locationQuery: { city: string; address: string };
  setLocationQuery: (q: { city: string; address: string }) => void;
  bloodGroupFilter: string;
  setBloodGroupFilter: (bloodGroup: string) => void;
}

const DonorSearchFilters = ({
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  bloodGroupFilter,
  setBloodGroupFilter,
}: DonorSearchFiltersProps) => {
  const [tempSearchField, setTempSearchField] = useState(searchQuery.field || "name");
  const [tempSearchValue, setTempSearchValue] = useState(searchQuery.value || "");

  const searchFields = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
  ];

  const bloodGroups = ["all", "A+", "A-", "A1", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleSearch = () => {
    setSearchQuery({ field: tempSearchField, value: tempSearchValue });
  };

  const handleClearSearch = () => {
    setTempSearchValue("");
    setSearchQuery({ field: "", value: "" });
  };

  const handleClearLocation = () => {
    setLocationQuery({ city: "", address: "" });
  };

  const handleClearAll = () => {
    setTempSearchValue("");
    setSearchQuery({ field: "", value: "" });
    setLocationQuery({ city: "", address: "" });
    setBloodGroupFilter("all");
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Advanced Search Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          <X className="h-3 w-3 mr-1" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Multi-field Search */}
        <div className="space-y-2">
          <Label className="text-xs">Search Field</Label>
          <Select value={tempSearchField} onValueChange={setTempSearchField}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {searchFields.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Search Value</Label>
          <div className="flex gap-2">
            <Input
              placeholder={`Enter ${tempSearchField}`}
              value={tempSearchValue}
              onChange={(e) => setTempSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button size="sm" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
            {(searchQuery.value) && (
              <Button variant="outline" size="sm" onClick={handleClearSearch}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Location Search */}
        <div className="space-y-2">
          <Label className="text-xs">City</Label>
          <Input
            placeholder="Search by city"
            value={locationQuery.city}
            onChange={(e) => setLocationQuery({ ...locationQuery, city: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Address</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Search by address"
              value={locationQuery.address}
              onChange={(e) => setLocationQuery({ ...locationQuery, address: e.target.value })}
            />
            {(locationQuery.city || locationQuery.address) && (
              <Button variant="outline" size="sm" onClick={handleClearLocation}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Blood Group Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-xs">Blood Group</Label>
          <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {bloodGroups.slice(1).map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(searchQuery.value || locationQuery.city || locationQuery.address || bloodGroupFilter !== "all") && (
        <div className="text-xs text-gray-600 border-t pt-2">
          <span className="font-medium">Active filters: </span>
          {searchQuery.value && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">{searchQuery.field}: {searchQuery.value}</span>}
          {locationQuery.city && <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">City: {locationQuery.city}</span>}
          {locationQuery.address && <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">Address: {locationQuery.address}</span>}
          {bloodGroupFilter !== "all" && <span className="bg-red-100 text-red-800 px-2 py-1 rounded mr-2">Blood: {bloodGroupFilter}</span>}
        </div>
      )}
    </div>
  );
};

export default DonorSearchFilters;
