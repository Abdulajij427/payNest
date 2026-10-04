export function Balance({ value }: { value: number | null }) {
  return (
    <div className="flex">
      <div className="font-bold text-lg">Your balance</div>
      <div className="font-semibold ml-4 text-lg">
        {value === null ? "Loading..." : "Rs " + value.toLocaleString("en-IN")}
      </div>
    </div>
  );
}