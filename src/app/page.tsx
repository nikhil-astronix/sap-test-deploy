import CurriculumList from "@/components/curriculum/CurriculumList";
import Selectdistricts from "./select-district/page";

export default function Home() {
  return (
    <main className="min-h-screen bg-white h-auto rounded-lg shadow-md">
      {/* <CurriculumList /> */}
      <Selectdistricts />
    </main>
  );
}
