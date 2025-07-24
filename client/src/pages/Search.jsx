import { InputWithLabel } from "../components/InputWithLabel.jsx";
export const Search = () => {
  return (
    <form
      method="POST"
      className="space-y-8 flex flex-col items-center p-2 w-full max-w-md md:max-w-2xl xl:max-w-md px-4"
    >
      <InputWithLabel
        label={"Search"}
        id={"search"}
        name={"search"}
        type={"search"}
      />
    </form>
  );
};
