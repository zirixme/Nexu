import image from "../assets/lucide/image.svg";
import clapperboard from "../assets/lucide/clapperboard.svg";

import { XIcon } from "lucide-react";

export const Create = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
      <form
        method="POST"
        className="bg-gray-50 max-w-md md:max-w-xl flex w-full flex-col items-center p-4 rounded border border-gray-400 gap-4 mx-2 xl:max-w-2xl relative"
      >
        <button className="absolute right-4 cursor-pointer" onClick={onClose}>
          <XIcon />
        </button>
        <textarea
          type="text"
          className="border-b border-gray-400 w-full resize-none p-2 focus:outline-none mt-4"
          placeholder="What’s happening?"
          rows={10}
        />
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <button className="cursor-pointer">
              <img src={image} alt="import image" />
            </button>
            <button className="cursor-pointer">
              <img src={clapperboard} alt="import a video" />
            </button>
          </div>
          <button className="bg-black text-gray-50 px-6 py-2 rounded">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};
