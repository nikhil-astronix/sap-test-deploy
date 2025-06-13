import { Section } from "@/models/calibration";
import { QuestionBlock } from "./QuestionBlock";

export const ObservationSection = ({
  section,
  totalObservers,
}: {
  section: Section;
  totalObservers: number;
}) => (
  <div className="space-y-6">
    <div className="bg-[#2264AC] text-white px-6 py-4 rounded-t-lg w-3/5 mx-auto ">
      <div className="text-center">
        <div className="text-sm font-medium mb-2">
          Core Question {section.section_id + 1}
        </div>
        <div className="text-base font-medium leading-relaxed">
          {section.section_description}
        </div>
      </div>
    </div>
    <h3 className="text-center text-lg font-semibold text-gray-900 mb-4">
      Total Observers ({totalObservers})
    </h3>
    {section.question_wise_data.map((q, i) => (
      <QuestionBlock
        key={q.question_id}
        question={q}
        questionIndex={i}
        totalObservers={totalObservers}
      />
    ))}
  </div>
);
