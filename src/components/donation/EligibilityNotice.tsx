
import React from "react";

const EligibilityNotice = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
      <p className="text-sm text-amber-800">
        <strong>Important:</strong> To be eligible for blood donation, you must:
      </p>
      <ul className="mt-2 text-sm text-amber-800 list-disc pl-5">
        <li>Be at least 18 years old</li>
        <li>Weigh at least 50kg</li>
        <li>Be in good health and feeling well</li>
        <li>Not have donated blood in the last 3 months</li>
      </ul>
    </div>
  );
};

export default EligibilityNotice;
