import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Upload, FileText } from "lucide-react";
import { Question } from "@/models/calibration";

const COLORS = ["#2563eb", "#dc2626", "#f59e0b"];

export const QuestionBlock = ({
  question,
  questionIndex,
  totalObservers,
}: {
  question: Question;
  questionIndex: number;
  totalObservers: number;
}) => {
  const title = `1 FSI ${String.fromCharCode(65 + questionIndex)}. ${
    question.question_text
  }`;
  return (
    <div className="bg-white  rounded-lg mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className=" border-gray-200 px-8 py-8 border-[1px] rounded-[12px] ">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">{title} *</h4>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              {question.sub_questions.map((sq) => (
                <li key={sq.id} className="list-disc">
                  {sq.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-8">
            {/* Table */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                  Observer Responses & Evidence ({totalObservers})
                </h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Compare individual feedback and review supporting evidence.
              </p>

              {/* Table */}
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Response
                      </th>
                      {question.sub_questions.map((sq) => (
                        <th
                          key={sq.id}
                          className="px-4 py-2 text-left text-sm font-medium text-gray-500"
                        >
                          {sq.text}
                        </th>
                      ))}
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Observer
                      </th>

                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Evidence
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {question.rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 flex items-center space-x-2 whitespace-nowrap">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              row.question_response === "Yes"
                                ? "bg-blue-600"
                                : row.question_response === "No"
                                ? "bg-purple-600"
                                : "bg-gray-400"
                            }`}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {row.question_response}
                          </span>
                        </td>
                        {question.sub_questions.map((sq, index) => (
                          <td
                            key={sq.id}
                            className="px-4 py-3 text-sm text-gray-600"
                          >
                            {row.sub_question_responses[index]?.[0] ||
                              "No Response"}
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">
                            {row.respondent_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {row.respondent_email}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900 mb-2">
                            {row.evidence_text}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {row.evidence_docs.map((doc, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-2"
                              >
                                <button className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                  {doc.name}
                                </button>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pie chart */}
            <div className="flex-shrink-0">
              <PieChart width={200} height={200}>
                <Pie
                  data={question.response_analysis}
                  dataKey="percentage"
                  nameKey="response"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ percentage }) => `${percentage}%`}
                >
                  {question.response_analysis.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className="mt-2 space-y-1 text-sm">
                {question.response_analysis.map((item, idx) => (
                  <div
                    key={item.response}
                    className="flex items-center space-x-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="font-medium">{item.response}</span>
                    <span className="text-gray-600">
                      {item.percentage}% (
                      {Math.round((item.percentage * totalObservers) / 100)}{" "}
                      votes)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
