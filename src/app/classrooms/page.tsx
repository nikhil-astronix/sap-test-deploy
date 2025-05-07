"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Edit2, Trash2, Archive, School, User, BarChart2, BookOpen, Tag, ChevronLeft, ChevronRight, Check } from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";
import MultiSelect from "@/components/ui/MultiSelect";
import { useRouter } from "next/navigation";

const mockActiveSchools = [
  {
    id: "1",
    name: "Elmwood Elementary School",
    classrooms: [
      {
        id: "1",
        course: "Course 1",
        teacher: "Teacher 1",
        grades: ["1", "2", "3"],
        instructionalMaterials: ["Illustrative Math"],
        tags: ["Coaching"],
      },
      {
        id: "2",
        course: "Course 2",
        teacher: "Teacher 2",
        grades: ["1", "2", "3"],
        instructionalMaterials: [],
        tags: ["Coaching", "Coaching"],
      },
      {
        id: "3",
        course: "Course 3",
        teacher: "Teacher 3",
        grades: ["1", "2", "3"],
        instructionalMaterials: ["Illustrative Math", "Amplify"],
        tags: [],
      },
      {
        id: "4",
        course: "Course 4",
        teacher: "Teacher 4",
        grades: ["1", "2", "3"],
        instructionalMaterials: ["Illustrative Math", "Amplify", "Wonders"],
        tags: ["Coaching", "Tag2", "Tag3"],
      },
    ],
  },
  {
    id: "2",
    name: "Jefferson Middle School",
    classrooms: [
      {
        id: "1",
        course: "Math 6",
        teacher: "Ms. Carter",
        grades: ["6"],
        instructionalMaterials: ["Eureka Math"],
        tags: ["Coaching"],
      },
      {
        id: "2",
        course: "Science 6",
        teacher: "Mr. Lee",
        grades: ["6"],
        instructionalMaterials: ["Amplify"],
        tags: ["Tag2"],
      },
    ],
  },
  {
    id: "3",
    name: "Lincoln Middle School",
    classrooms: [
      {
        id: "1",
        course: "English 7",
        teacher: "Mrs. Smith",
        grades: ["7"],
        instructionalMaterials: ["Wonders"],
        tags: [],
      },
      {
        id: "2",
        course: "History 8",
        teacher: "Mr. Brown",
        grades: ["8"],
        instructionalMaterials: ["Illustrative Math"],
        tags: ["Tag3"],
      },
    ],
  },
];

const mockArchivedSchools = [
  {
    id: "4",
    name: "Washington High School",
    classrooms: [
      {
        id: "1",
        course: "AP Biology",
        teacher: "Dr. Johnson",
        grades: ["11", "12"],
        instructionalMaterials: ["OpenStax"],
        tags: ["Archive 2023"],
      },
      {
        id: "2",
        course: "Chemistry",
        teacher: "Ms. White",
        grades: ["10"],
        instructionalMaterials: ["Pearson"],
        tags: ["Archive 2023", "Lab Required"],
      },
    ],
  },
  {
    id: "5",
    name: "Roosevelt Elementary",
    classrooms: [
      {
        id: "1",
        course: "4th Grade Math",
        teacher: "Mr. Davis",
        grades: ["4"],
        instructionalMaterials: ["Eureka Math"],
        tags: ["Archive 2022"],
      },
    ],
  },
];

const gradeOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
];
const instructionalOptions = [
  { label: "Illustrative Math", value: "Illustrative Math" },
  { label: "Amplify", value: "Amplify" },
  { label: "Wonders", value: "Wonders" },
];
const tagOptions = [
  { label: "Coaching", value: "Coaching" },
  { label: "Tag2", value: "Tag2" },
  { label: "Tag3", value: "Tag3" },
];

export default function ClassroomsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ schoolId: string; classroomId: string } | null>(null);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(true);
  const [editData, setEditData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const rowsPerPage = 5;
  const router = useRouter();

  const schools = active ? mockActiveSchools : mockArchivedSchools;
  const paginatedSchools = schools.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(schools.length / rowsPerPage);

  const handleExpand = (schoolId: string) => {
    setExpanded(expanded === schoolId ? null : schoolId);
    setEditing(null);
  };

  const handleEdit = (schoolId: string, classroom: any) => {
    setEditing({ schoolId, classroomId: classroom.id });
    setEditData({ ...classroom });
  };

  const handleEditChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setEditing(null);
    // Save logic here
  };

  const handleCloseEdit = () => {
    setEditing(null);
  };

  const handleSelectRow = (schoolId: string, classroomId: string) => {
    const rowId = `${schoolId}-${classroomId}`;
    const newSelected = new Set<string>(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
    updateSelectAllState(newSelected);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set<string>());
    } else {
      const allRows = new Set<string>();
      paginatedSchools.forEach(school => {
        school.classrooms.forEach(classroom => {
          allRows.add(`${school.id}-${classroom.id}`);
        });
      });
      setSelectedRows(allRows);
    }
    setSelectAll(!selectAll);
  };

  const updateSelectAllState = (selected: Set<string>) => {
    let totalRows = 0;
    paginatedSchools.forEach(school => {
      totalRows += school.classrooms.length;
    });
    setSelectAll(selected.size === totalRows);
  };

  return (
    <div className="container mx-auto px-4 py-8 h-full bg-white rounded-lg shadow-md overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-2">Classrooms</h1>
      <p className="text-center text-gray-600 mb-6">Easily access and manage all your classrooms from one place.</p>

      {editing ? (
        <div className="flex items-center gap-4 mb-4">
          <button className="text-gray-700 text-sm font-medium" onClick={handleCloseEdit}>Close</button>
          <button className="bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-colors" onClick={handleSave}>Save Changes</button>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-2">
          <input
            className="border rounded-lg px-3 py-2 w-1/3 text-sm"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500"><Archive size={20} /></button>
            <button className="p-2 text-gray-500"><Trash2 size={20} /></button>
            <button 
              onClick={() => router.push('/classrooms/new')}
              className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2 text-sm"
            >
              + Add
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4 mt-4">
        <span className="mr-2 text-sm">Active</span>
        <button
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${active ? "bg-emerald-600" : "bg-gray-200"}`}
          onClick={() => setActive(a => !a)}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${active ? "translate-x-6" : "translate-x-1"}`} />
        </button>
        <span className="ml-2 text-sm">Archived</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#2264AC] text-white border-b border-gray-300">
              <th className="w-[5%] px-4 py-3 text-left border-r border-gray-300">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded-md border-2 border-gray-300 text-[#2264AC] focus:ring-[#2264AC] focus:ring-2 bg-white cursor-pointer"
                  />
                </div>
              </th>
              <th className="w-[25%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <div className="flex items-center gap-2">
                  <School size={16} />Course
                </div>
              </th>
              <th className="w-[15%] px-4 py-3 text-left font-semibold border-r border-gray-300"><span className="inline-flex items-center gap-2"><User size={16} />Teacher</span></th>
              <th className="w-[15%] px-4 py-3 text-left font-semibold border-r border-gray-300"><span className="inline-flex items-center gap-2"><BarChart2 size={16} />Grades</span></th>
              <th className="w-[20%] px-4 py-3 text-left font-semibold border-r border-gray-300"><span className="inline-flex items-center gap-2"><BookOpen size={16} />Instructional Materials</span></th>
              <th className="w-[15%] px-4 py-3 text-left font-semibold border-r border-gray-300"><span className="inline-flex items-center gap-2"><Tag size={16} />Tags & Attribute(s)</span></th>
              <th className="w-[5%] px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedSchools.map(school => (
              <React.Fragment key={school.id}>
                <tr className="bg-[#F3F8FF] hover:bg-[#E5F0FF] cursor-pointer border-y border-gray-300" onClick={() => handleExpand(school.id)}>
                  <td className="px-4 py-3 border-r border-gray-200 bg-[#F8FAFC]">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(school.id)}
                        onChange={() => handleSelectRow(school.id, 'all')}
                        onClick={e => e.stopPropagation()}
                        className="w-4 h-4 rounded-md border-2 border-gray-300 text-[#2264AC] focus:ring-[#2264AC] focus:ring-2 bg-white cursor-pointer"
                      />
                    </div>
                  </td>
                  <td colSpan={6} className="px-4 py-3 border-b border-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{school.name}</span>
                      <span>{expanded === school.id ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}</span>
                    </div>
                  </td>
                </tr>
                {expanded === school.id && school.classrooms.length > 0 && (
                  school.classrooms.map(classroom => (
                    <tr key={classroom.id} className="border-b border-gray-200 hover:bg-gray-50">
                      {editing && editing.schoolId === school.id && editing.classroomId === classroom.id ? (
                        <>
                          <td className="px-4 py-3 border-r border-gray-200 bg-[#F8FAFC]">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedRows.has(`${school.id}-${classroom.id}`)}
                                onChange={() => handleSelectRow(school.id, classroom.id)}
                                onClick={e => e.stopPropagation()}
                                className="w-4 h-4 rounded-md border-2 border-gray-300 text-[#2264AC] focus:ring-[#2264AC] focus:ring-2 bg-white cursor-pointer"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <input
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              value={editData.course}
                              onChange={e => handleEditChange("course", e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <input
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              value={editData.teacher}
                              onChange={e => handleEditChange("teacher", e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <MultiSelect
                              options={gradeOptions}
                              values={editData.grades}
                              onChange={vals => handleEditChange("grades", vals)}
                              placeholder="Select grades"
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <MultiSelect
                              options={instructionalOptions}
                              values={editData.instructionalMaterials}
                              onChange={vals => handleEditChange("instructionalMaterials", vals)}
                              placeholder="Select materials"
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <MultiSelect
                              options={tagOptions}
                              values={editData.tags}
                              onChange={vals => handleEditChange("tags", vals)}
                              placeholder="Select tags"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            {/* No edit icon in edit mode */}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 border-r border-gray-200 bg-[#F8FAFC]">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedRows.has(`${school.id}-${classroom.id}`)}
                                onChange={() => handleSelectRow(school.id, classroom.id)}
                                onClick={e => e.stopPropagation()}
                                className="w-4 h-4 rounded-md border-2 border-gray-300 text-[#2264AC] focus:ring-[#2264AC] focus:ring-2 bg-white cursor-pointer"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">{classroom.course}</td>
                          <td className="px-4 py-2 border-r border-gray-200">{classroom.teacher}</td>
                          <td className="px-4 py-2 border-r border-gray-200">{classroom.grades.join(", ")}</td>
                          <td className="px-4 py-2 border-r border-gray-200">{classroom.instructionalMaterials.length > 0 ? classroom.instructionalMaterials.join(", ") : "None"}</td>
                          <td className="px-4 py-2 border-r border-gray-200">{
                            classroom.tags.length > 0
                              ? classroom.tags[0] + (classroom.tags.length > 1 ? ` + ${classroom.tags.length - 1} more` : "")
                              : "None"
                          }</td>
                          <td className="px-4 py-2 text-center">
                            <button className="text-emerald-700" onClick={e => { e.stopPropagation(); handleEdit(school.id, classroom); }}>
                              <Edit2 size={18} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-white text-xs mt-2">
          <div>
            <span className="text-gray-600">{(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, schools.length)} of {schools.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Rows per page:</span>
            <select className="border rounded px-2 py-1 text-xs" value={rowsPerPage} disabled>
              <option value={5}>5</option>
            </select>
            <button
              className="p-1 rounded disabled:text-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-gray-600">{currentPage}/{totalPages}</span>
            <button
              className="p-1 rounded disabled:text-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 