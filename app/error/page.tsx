"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";

const page = () => {
  useEffect(() => {
    toast.error("An Unexpected Error Occured");
  }, []);
  return <div>Error</div>;
};

export default page;
