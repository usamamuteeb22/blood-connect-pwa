
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RequestHeader from "@/components/request/RequestHeader";
import RequestList from "@/components/request/RequestList";
import RequestCallToAction from "@/components/request/RequestCallToAction";

const Request = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <RequestHeader />
        <RequestList />
        <RequestCallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Request;
