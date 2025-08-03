import React from "react";
import Profileinfo from "./Profileinfo";
import NewDM from "./ContactContainer/newDm";

const Contactscontainer = () => {
  return (
    <div className="flex flex-col justify-between h-full p-5 relative md:md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-2 border-[#2f303b] w-full">
      <div>
        <h3 className="font-bold">Chats</h3>
        <div className="my-5 mx-5">
          <div className="flex items-center justify-between pr-10">
            <Title text="Direct Mesaages" />
            <NewDM />
          </div>
        </div>
        <div className="my-5 mx-5">
          <div className="flex items-center justify-between pr-10">
            <Title text="Channel" />
          </div>
        </div>
      </div>

      <Profileinfo />
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};

export default Contactscontainer;
