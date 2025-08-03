import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api_client.js";
import { HOST } from "../../../util/constant.js";
import { getColor } from "@/lib/utils.js";
import { animationDefaultOptions } from "@/lib/utils.js";
import { SEARCH_CONTACTS_ROUTES } from "../../../util/constant.js";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useEffect } from "react";
//import { createChatSlice } from "@/store/slices/chat-slice.js";
import { useAppStore } from "@/store/index.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";

const NewDM = () => {
  const {
    //selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
    //setSelectedChatMessages,
  } = useAppStore();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchContacts = async (searchTerm) => {
    try {
      setSearchTerm(searchTerm); // keep in state
      const response = await apiClient.post(
        SEARCH_CONTACTS_ROUTES,
        { searchTerm },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.contacts) {
        setSearchedContacts(response.data.contacts);
      }
    } catch (error) {
      console.log({ error });
    }
  };
  const selectnewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
    //console.log("Selected contact set:", contact); // confirm it's passed
  };
  //console.log(selectedChatData);
  useEffect(() => {
    if (openNewContactModal) {
      searchContacts(""); // fetch all contacts initially
    }
  }, [openNewContactModal]);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-4 bg-[#1e2c3a] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[250px] overflow-y-auto">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  key={contact.id} // Ensure each contact has a unique id
                  className="flex gap-3 items-center cursor-pointer p-2 rounded hover:bg-gray-100"
                  onClick={() => selectnewContact(contact)}
                >
                  <div className="w-12 h-12 relative">
                    <Avatar className="w-12 h-12 rounded-full overflow-hidden relative">
                      {contact.image ? (
                        <AvatarImage
                          src={`${contact.image}`}
                          alt="profile"
                          className="object-cover w-full h-full rounded-4xl"
                        />
                      ) : (
                        <div
                          className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full  ${getColor(
                            contact.color
                          )}`}
                        >
                          <span>
                            {contact.fullname
                              ? contact.fullname[0]
                              : contact.email[0]}
                          </span>
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {contact.fullname
                        ? `${contact.fullname}`
                        : contact.fullname || "N/A"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {contact.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {searchedContacts.length <= 0 && (
            <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-xl text-xl trasition-all duration-100 text-center">
                <h3 className="poppins-medium">
                  Search Your <span className="text-purple-500">Contacts!</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
