import { ObservationAPI } from "@/models/calibration";
import { format } from "date-fns";

export const Navigation = ({ info }: { info: ObservationAPI }) => {
  const dateObj = new Date(info.date);
  const day = format(dateObj, "dd");
  const month = format(dateObj, "LLLL");

  return (
    <div className="bg-[#F4F6F8] border-b border-gray-200 py-4 w-4/5 mx-auto border-[0.8px] rounded-[12px]">
      <div className="max-w-7xl mx-auto px-6 flex items-center">
        <div className="mr-6 flex flex-col w-12 h-12 rounded shadow overflow-hidden">
          <div className="bg-green-900 text-white text-xs font-semibold uppercase flex items-center justify-center h-1/2">
            {month}
          </div>
          <div className="text-green-900 text-lg font-bold leading-none flex items-center justify-center h-1/2">
            {day}
          </div>
        </div>

        <div className="mr-auto">
          <h1 className="text-lg font-semibold">
            {info.school} Observation Session
          </h1>
          <p className="text-sm text-gray-600">
            Classroom: {info.classroom_course} ({info.classroom_teacher_name})
          </p>
        </div>

        <div>
          <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
            {info.observation_tool}
          </span>
        </div>
      </div>
    </div>
  );
};
