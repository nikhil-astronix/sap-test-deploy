'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ArchiveButton from '@/components/ui/Archive';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  district: string;
  school: string;
  role: string;
  userType: string;
}

export default function Usertable() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  const users: User[] = [
		{
			id: 1,
			firstName: "Jane",
			lastName: "Doe",
			email: "jane@example.com",
			district: "New York City Department of Education",
			school: "Elmwood Elementary School",
			role: "Centerofficer/District ",
			userType: "oberver",
		},
		{
			id: 2,
			firstName: "John",
			lastName: "Doe",
			email: "john@example.com",
			district: "Los Angeles Unified School District",
			school: "Jefferson Middle School",
			role: "Instructional Coach",
			userType: "observer",
		},
		{
			id: 3,
			firstName: "Jane",
			lastName: "Doe",
			email: "jane@example.com",
			district: "Chicago Public Schools",
			school: "Eastwood High School",
			role: "Professional learning",
			userType: "District Admin",
		},
		{
			id: 4,
			firstName: "John",
			lastName: "Doe",
			email: "john@example.com",
			district: "Clard County School District",
			school: "Lincoln Middle School",
			role: "School leader",
			userType: "observer",
		},
		{
			id: 5,
			firstName: "Jane",
			lastName: "Doe",
			email: "jane@example.com",
			district: "Broward County Public Schools",
			school: "Riverside Elementary School",
			role: "Centerofficer/District ",
			userType: "oberver",
		},
		{
			id: 6,
			firstName: "John",
			lastName: "Doe",
			email: "john@example.com",
			district: "Houston Independent School District",
			school: "Westview High School",
			role: "Instructional Coach",
			userType: "observer",
		},
		{
			id: 7,
			firstName: "Jane",
			lastName: "Doe",
			email: "jane@example.com",
			district: "Hawaii Department of Education",
			school: "Northgate Middle School",
			role: "Professional learning",
			userType: "District Admin",
		},
		{
			id: 8,
			firstName: "John",
			lastName: "Doe",
			email: "john@example.com",
			district: "Orange County Public Schools",
			school: "Pinecrest High School",
			role: "School leader",
			userType: "observer",
		},
		{
			id: 9,
			firstName: "Jane",
			lastName: "Doe",
			email: "jane@example.com",
			district: "School District of Palm Beach County",
			school: "George High School",
			role: "Centerofficer/District ",
			userType: "oberver",
		},
		{
			id: 10,
			firstName: "John",
			lastName: "Doe",
			email: "john@example.com",
			district: "Fairfax County Public Schools",
			school: "Fairfax County Public School",
			role: "Instructional Coach",
			userType: "observer",
		},
	];

  const totalItems = 97;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const paginatedUsers = users.slice(startItem - 1, endItem);

  return (
    <div className="px-6 py-2 w-full flex flex-col h-full">
      <div className="flex-none space-y-6 mb-8">

        {/* {editingRowId !== null && (
          <div className="flex justify-between items-center bg-yellow-50 p-3 rounded shadow-md">
            <button onClick={() => setEditingRowId(null)} className="text-red-600">Close</button>
            <button onClick={() => setEditingRowId(null)} className="bg-green-600 text-white px-3 py-1 rounded">Save Changes</button>
          </div>
        )} */}

        <div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">Users</h1>
          <p className="mt-1 text-sm text-gray-600 text-center">
            Browse all users across districts. Add, update, or archive user accounts as needed.
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={`flex justify-between items-center ${editingRowId !== null ? 'blur-sm pointer-events-none' : ''}`}
        >
          <div className="relative w-96">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border rounded-lg pr-20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <ArchiveButton onClick={() => setShowCheckboxes((prev) => !prev)} />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/curriculums/new')}
              className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              + New
            </motion.button>
          </div>
        </motion.div>
        {editingRowId !== null &&(
        <div className="flex items-center space-x-2">
    <button
      onClick={() => {
        setShowCheckboxes(false)
        setEditingRowId(null)
      }}
      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
    >
      Close
    </button>
    <button
      onClick={() => {
        setShowCheckboxes(false)
        setEditingRowId(null)
      }}
      className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
    >
      Save Changes
    </button>
  </div>)}

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span>Active</span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowArchived(!showArchived)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-emerald-600"
            >
              <motion.span
                layout
                initial={false}
                animate={{ x: showArchived ? 24 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="inline-block h-4 w-4 rounded-full bg-white"
              />
            </motion.button>
            <span>Archived</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto relative">
          <table className="min-w-[1200px] table-auto border-separate border-spacing-0">
            <thead>
              <tr>
                {showCheckboxes && <th className="w-12 border-b border-gray-300 bg-purple-100"></th>}
                <th className="border-b border-gray-300 text-left px-4 py-2 bg-purple-100">First Name</th>
                <th className="border-b border-gray-300 text-left px-4 py-2 bg-purple-100">Last Name</th>
                <th className="border-b border-gray-300 text-left px-4 py-2 bg-purple-100">Email</th>
                <th className="border-b border-gray-300 text-left px-4 py-2 bg-purple-100">District</th>
                <th className="border-b border-gray-300 text-left px-4 py-2 bg-purple-100">School</th>
                <th className="border-b border-gray-300 text-left px-4 py-2 bg-purple-100">Role</th>
                <th className="border-b border-gray-300 text-left px-4 py-2 bg-purple-100">User Type</th>
                <th className="border-b border-gray-300 text-left px-4 py-2 bg-purple-100 sticky right-0 z-20 shadow-md">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className={`even:bg-gray-50 ${editingRowId === user.id ? 'bg-yellow-100' : editingRowId !== null ? 'blur-sm' : ''}`}>
                  {showCheckboxes && (
                    <td className="px-4 py-2 border-b border-gray-300">
                      <input type="checkbox" />
                    </td>
                  )}
                  <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                    {editingRowId === user.id ? <input defaultValue={user.firstName} className="border rounded px-2 py-1" /> : user.firstName}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                    {editingRowId === user.id ? <input defaultValue={user.lastName} className="border rounded px-2 py-1" /> : user.lastName}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                    {editingRowId === user.id ? <input defaultValue={user.email} className="border rounded px-2 py-1" /> : user.email}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                    {editingRowId === user.id ? <input defaultValue={user.district} className="border rounded px-2 py-1" /> : user.district}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                    {editingRowId === user.id ? <input defaultValue={user.school} className="border rounded px-2 py-1" /> : user.school}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                    {editingRowId === user.id ? <input defaultValue={user.role} className="border rounded px-2 py-1" /> : user.role}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
                    {editingRowId === user.id ? <input defaultValue={user.userType} className="border rounded px-2 py-1" /> : user.userType}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 bg-white sticky right-0 z-20 shadow-md">
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => setEditingRowId(user.id)}>✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full overflow-x-auto mt-4">
          <div className="flex items-center justify-between min-w-[700px] rounded-md border p-3 shadow-sm bg-white text-sm">
            <span className="text-gray-700">
              {startItem + 1}-{endItem} of {totalItems}
            </span>

            <div className="flex items-center gap-2">
              <label className="text-gray-600">Rows per page:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
              >
                {[10, 25, 50].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="px-2 py-1 border rounded disabled:opacity-30"
              >
                <ArrowLeft size={16} />
              </button>

              <span className="px-2">{currentPage}/{totalPages}</span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                className="px-2 py-1 border rounded disabled:opacity-30"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
