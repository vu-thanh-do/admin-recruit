import React from "react";
import AllRequest from "@/components/all-request/all-request";
export default function page() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý yêu cầu tuyển dụng</h1>
      </div>
      <AllRequest />
    </div>
  );
}