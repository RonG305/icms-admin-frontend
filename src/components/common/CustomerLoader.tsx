import { Spinner } from "../ui/spinner";

  export const CustomLoader = ({name}: {name: string}) => (
    <div className="flex flex-col items-center justify-center py-10">
      <Spinner />
      <p className="mt-4 text-muted-foreground">{name}</p>
    </div>
  );