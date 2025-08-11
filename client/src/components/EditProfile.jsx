import { XIcon } from "lucide-react";
export const EditProfile = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
      <form
        method="POST"
        className="bg-gray-50 max-w-md md:max-w-xl flex w-full flex-col items-center p-4 rounded border border-gray-400 gap-4 mx-2 xl:max-w-2xl relative"
      >
        <button className="absolute right-4 cursor-pointer" onClick={onClose}>
          <XIcon />
        </button>
      </form>
    </div>
  );
};
