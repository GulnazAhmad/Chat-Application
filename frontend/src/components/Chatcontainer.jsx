import React from "react";
import Chatheader from "./Chatheader";
import Messagecontainer from "./Messagecontainer";
import Messagebar from "./Messagebar";

const Chatcontainer = () => {
  return (
    <div className=" top-0 h-[100vh] w-full bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <Chatheader />
      <Messagecontainer />
      <Messagebar />
    </div>
  );
};

export default Chatcontainer;
