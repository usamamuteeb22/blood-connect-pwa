
import { useState, useEffect } from "react";
import RequestHeader from "@/components/request/RequestHeader";
import RequestList from "@/components/request/RequestList";
import RequestCallToAction from "@/components/request/RequestCallToAction";

const Request = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar is now rendered globally in App */}
      <main className="flex-grow">
        <RequestHeader />
        <RequestList />
        <RequestCallToAction />
      </main>
    </div>
  );
};

export default Request;
