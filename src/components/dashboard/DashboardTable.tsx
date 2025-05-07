// "use client";

// import { useState } from 'react';
// import { 
//   ChevronDown, 
//   ChevronUp, 
//   ChevronLeft, 
//   ChevronRight,
//   Network,
//   Building2,
//   Users,
//   Hash,
//   Clock,
//   ActivitySquare,
//   Settings
// } from 'lucide-react';

// // Define the data structure
// type StatusType = 'No Session' | 'Inactive' | 'Active';
// type SetupStatusType = 'Incomplete' | 'Partial' | 'Complete';

// interface TableRow {
//   id: number;
//   network: string;
//   district: string;
//   admins: {
//     names: string[];
//     more?: number;
//   };
//   users: number;
//   lastSession: string | null;
//   sessionStatus: StatusType;
//   setupStatus: SetupStatusType;
// }

// // Column definition for dynamic columns
// interface Column {
//   key: keyof TableRow;
//   label: string;
//   icon: React.ReactNode;
//   sortable: boolean;
// }

// const DashboardTable = () => {
//   // Sample data
//   const sampleData: TableRow[] = [
//     {
//       id: 1,
//       network: 'Blue Ridge Charter Collaborative',
//       district: 'New York City Department of Education',
//       admins: { names: ['Jane Doe', 'John Doe'], more: 2 },
//       users: 0,
//       lastSession: null,
//       sessionStatus: 'No Session',
//       setupStatus: 'Incomplete',
//     },
//     {
//       id: 2,
//       network: 'Cedar Grove Charter Network',
//       district: 'Los Angeles Unified School District',
//       admins: { names: ['John Doe'], more: 0 },
//       users: 0,
//       lastSession: null,
//       sessionStatus: 'No Session',
//       setupStatus: 'Incomplete',
//     },
//     {
//       id: 3,
//       network: 'Charter Network',
//       district: 'Chicago Public Schools',
//       admins: { names: ['Jane Doe'], more: 0 },
//       users: 5,
//       lastSession: null,
//       sessionStatus: 'No Session',
//       setupStatus: 'Partial',
//     },
//     {
//       id: 4,
//       network: 'Charter Network',
//       district: 'Clard County School District',
//       admins: { names: ['John Doe'], more: 0 },
//       users: 20,
//       lastSession: 'April 2, 2025',
//       sessionStatus: 'Inactive',
//       setupStatus: 'Complete',
//     },
//     {
//       id: 5,
//       network: 'None',
//       district: 'Broward County Public Schools',
//       admins: { names: ['Jane Doe', 'John Doe'], more: 2 },
//       users: 5,
//       lastSession: 'April 6, 2025',
//       sessionStatus: 'Inactive',
//       setupStatus: 'Complete',
//     },
//     {
//       id: 6,
//       network: 'None',
//       district: 'Houston Independent School District',
//       admins: { names: ['Jane Doe'], more: 0 },
//       users: 20,
//       lastSession: 'April 6, 2025',
//       sessionStatus: 'Active',
//       setupStatus: 'Complete',
//     },
//     {
//       id: 7,
//       network: 'Foundations Education Collaborative',
//       district: 'Hawaii Department of Education',
//       admins: { names: ['John Doe'], more: 0 },
//       users: 9,
//       lastSession: 'February 25, 2025',
//       sessionStatus: 'Active',
//       setupStatus: 'Complete',
//     },
//     {
//       id: 8,
//       network: 'None',
//       district: 'Orange County Public Schools',
//       admins: { names: ['Jane Doe'], more: 0 },
//       users: 4,
//       lastSession: 'December 10, 2025',
//       sessionStatus: 'Active',
//       setupStatus: 'Complete',
//     },
//     {
//       id: 9,
//       network: 'Pinnacle Charter Network',
//       district: 'School District of Palm Beach County',
//       admins: { names: ['Jane Doe', 'John Doe'], more: 3 },
//       users: 17,
//       lastSession: 'October 27, 2025',
//       sessionStatus: 'Active',
//       setupStatus: 'Complete',
//     },
//   ];

//   // State for current data, sorting, and pagination
//   const [data, setData] = useState<TableRow[]>(sampleData);
//   const [sortConfig, setSortConfig] = useState<{ key: keyof TableRow | null; direction: 'asc' | 'desc' | null }>({
//     key: null,
//     direction: null,
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(9);
//   const [visibleColumns, setVisibleColumns] = useState<(keyof TableRow)[]>([
//     'network', 'district', 'admins', 'users', 'lastSession', 'sessionStatus', 'setupStatus'
//   ]);

//   // Column definitions
//   const columns: Column[] = [
//     { key: 'network', label: 'Network', icon: <Network size={16} />, sortable: true },
//     { key: 'district', label: 'District', icon: <Building2 size={16} />, sortable: true },
//     { key: 'admins', label: 'Admins', icon: <Users size={16} />, sortable: false },
//     { key: 'users', label: 'Number of Users', icon: <Hash size={16} />, sortable: true },
//     { key: 'lastSession', label: 'Last Session', icon: <Clock size={16} />, sortable: true },
//     { key: 'sessionStatus', label: 'Session Status', icon: <ActivitySquare size={16} />, sortable: true },
//     { key: 'setupStatus', label: 'Setup Status', icon: <Settings size={16} />, sortable: true },
//   ];

//   // Sorting handler
//   const requestSort = (key: keyof TableRow) => {
//     let direction: 'asc' | 'desc' | null = 'asc';
    
//     if (sortConfig.key === key) {
//       if (sortConfig.direction === 'asc') {
//         direction = 'desc';
//       } else if (sortConfig.direction === 'desc') {
//         direction = null;
//       }
//     }
    
//     setSortConfig({ key, direction });
    
//     // Sort the data accordingly
//     if (direction === null) {
//       setData([...sampleData]); // Reset to original order
//     } else {
//       const sortedData = [...data].sort((a, b) => {
//         if (key === 'admins') {
//           return 0; // Don't sort by admins
//         }
        
//         if (a[key] === null) return 1;
//         if (b[key] === null) return -1;
        
//         if (typeof a[key] === 'string' && typeof b[key] === 'string') {
//           return direction === 'asc' 
//             ? (a[key] as string).localeCompare(b[key] as string)
//             : (b[key] as string).localeCompare(a[key] as string);
//         }
        
//         return direction === 'asc'
//           ? (a[key] as number) - (b[key] as number)
//           : (b[key] as number) - (a[key] as number);
//       });
      
//       setData(sortedData);
//     }
//   };

//   // Get current page data
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

//   // Get session status badge
//   const getSessionStatusBadge = (status: StatusType) => {
//     switch (status) {
//       case 'Active':
//         return <span className="inline-flex items-center gap-1 bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs"><span className="w-2 h-2 bg-green-600 rounded-full"></span> {status}</span>;
//       case 'Inactive':
//         return <span className="inline-flex items-center gap-1 bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs"><span className="w-2 h-2 bg-yellow-600 rounded-full"></span> {status}</span>;
//       case 'No Session':
//         return <span className="inline-flex items-center gap-1 bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs"><span className="w-2 h-2 bg-red-600 rounded-full"></span> {status}</span>;
//       default:
//         return status;
//     }
//   };

//   // Get setup status badge
//   const getSetupStatusBadge = (status: SetupStatusType) => {
//     switch (status) {
//       case 'Complete':
//         return <span className="inline-flex items-center gap-1 text-green-600 px-2 py-1 text-xs"><span className="w-2 h-2 bg-green-600 rounded-full"></span> {status}</span>;
//       case 'Partial':
//         return <span className="inline-flex items-center gap-1 text-yellow-600 px-2 py-1 text-xs"><span className="w-2 h-2 bg-yellow-600 rounded-full"></span> {status}</span>;
//       case 'Incomplete':
//         return <span className="inline-flex items-center gap-1 text-red-600 px-2 py-1 text-xs"><span className="w-2 h-2 bg-red-600 rounded-full"></span> {status}</span>;
//       default:
//         return status;
//     }
//   };

//   // Render cell content
//   const renderCell = (row: TableRow, column: keyof TableRow) => {
//     if (column === 'admins') {
//       const { names, more } = row.admins;
//       return (
//         <div>
//           {names.join(', ')}
//           {more ? ` +${more} more` : ''}
//         </div>
//       );
//     } else if (column === 'sessionStatus') {
//       return getSessionStatusBadge(row.sessionStatus);
//     } else if (column === 'setupStatus') {
//       return getSetupStatusBadge(row.setupStatus);
//     } else {
//       return row[column];
//     }
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-white">
//             {columns
//               .filter(col => visibleColumns.includes(col.key))
//               .map((column) => (
//                 <th 
//                   key={column.key}
//                   className="border-b whitespace-nowrap bg-blue-400 border-gray-200 p-3 text-left font-medium text-white text-sm"
//                 >
//                   <button
//                     className="flex items-center space-x-1 focus:outline-none"
//                     onClick={() => column.sortable ? requestSort(column.key) : null}
//                     disabled={!column.sortable}
//                   >
//                     <span>{column.icon}</span>
//                     <span>{column.label}</span>
//                     {column.sortable && (
//                       <span className="ml-1">
//                         {sortConfig.key === column.key ? (
//                           sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
//                         ) : (
//                           <ChevronDown size={14} className="text-gray-300" />
//                         )}
//                       </span>
//                     )}
//                   </button>
//                 </th>
//               ))}
//           </tr>
//         </thead>
//         <tbody>
//           {currentRows.map((row) => (
//             <tr key={row.id} className="hover:bg-gray-50">
//               {columns
//                 .filter(col => visibleColumns.includes(col.key))
//                 .map((column) => (
//                   <td key={`${row.id}-${column.key}`} className="border-b border-gray-200 p-3 text-sm">
//                     {renderCell(row, column.key)}
//                   </td>
//                 ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="flex items-center justify-between mt-4 text-sm">
//         <div>
//           {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, data.length)} of {data.length}
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <div>
//             Rows per page: 
//             <select 
//               value={rowsPerPage}
//               onChange={(e) => setRowsPerPage(Number(e.target.value))}
//               className="ml-2 border border-gray-300 rounded p-1"
//             >
//               <option value={9}>9</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//               <option value={100}>100</option>
//             </select>
//           </div>
          
//           <div className="flex items-center space-x-1">
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
//             >
//               <ChevronLeft size={16} />
//             </button>
//             <span>{currentPage}/{Math.ceil(data.length / rowsPerPage)}</span>
//             <button
//               onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(data.length / rowsPerPage)))}
//               disabled={currentPage >= Math.ceil(data.length / rowsPerPage)}
//               className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardTable;



"use client";

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight,
  Network,
  Building2,
  Users,
  Hash,
  Clock,
  ActivitySquare,
  Settings
} from 'lucide-react';

// Define the data structure
export type StatusType = 'No Session' | 'Inactive' | 'Active';
export type SetupStatusType = 'Incomplete' | 'Partial' | 'Complete';

export interface TableRow {
  id: number;
  network?: string;
  district?: string;
  admins?: {
    names: string[];
    more?: number;
  };
  users?: number;
  lastSession?: string | null;
  sessionStatus?: StatusType;
  setupStatus?: SetupStatusType;
  [key: string]: any; // Allow for additional fields
}

// Column definition for dynamic columns
export interface Column {
  key: string;
  label: string;
  icon: React.ReactNode;
  sortable: boolean;
}

interface DashboardTableProps {
  data: TableRow[];
  columns: Column[];
  headerColor: string;
}

const DashboardTable = ({ data: initialData, columns, headerColor }: DashboardTableProps) => {
  // State for current data, sorting, and pagination
  const [data, setData] = useState<TableRow[]>(initialData);
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' | null }>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [visibleColumns] = useState<string[]>(columns?.map(col => col.key));

  // Sorting handler
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
    
    // Sort the data accordingly
    if (direction === null) {
      setData([...initialData]); // Reset to original order
    } else {
      const sortedData = [...data].sort((a, b) => {
        if (key === 'admins') {
          return 0; // Don't sort by admins
        }
        
        if (a[key] === null || a[key] === undefined) return 1;
        if (b[key] === null || b[key] === undefined) return -1;
        
        if (typeof a[key] === 'string' && typeof b[key] === 'string') {
          return direction === 'asc' 
            ? (a[key] as string).localeCompare(b[key] as string)
            : (b[key] as string).localeCompare(a[key] as string);
        }
        
        return direction === 'asc'
          ? (a[key] as number) - (b[key] as number)
          : (b[key] as number) - (a[key] as number);
      });
      
      setData(sortedData);
    }
  };

  // Get current page data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data?.slice(indexOfFirstRow, indexOfLastRow);

  // Get session status badge
  const getSessionStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center gap-1 bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs"><span className="w-2 h-2 bg-green-600 rounded-full"></span> {status}</span>;
      case 'Inactive':
        return <span className="inline-flex items-center gap-1 bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs"><span className="w-2 h-2 bg-yellow-600 rounded-full"></span> {status}</span>;
      case 'No Session':
        return <span className="inline-flex items-center gap-1 bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs"><span className="w-2 h-2 bg-red-600 rounded-full"></span> {status}</span>;
      default:
        return status;
    }
  };

  // Get setup status badge
  const getSetupStatusBadge = (status: SetupStatusType) => {
    switch (status) {
      case 'Complete':
        return <span className="inline-flex items-center gap-1 text-green-600 px-2 py-1 text-xs"><span className="w-2 h-2 bg-green-600 rounded-full"></span> {status}</span>;
      case 'Partial':
        return <span className="inline-flex items-center gap-1 text-yellow-600 px-2 py-1 text-xs"><span className="w-2 h-2 bg-yellow-600 rounded-full"></span> {status}</span>;
      case 'Incomplete':
        return <span className="inline-flex items-center gap-1 text-red-600 px-2 py-1 text-xs"><span className="w-2 h-2 bg-red-600 rounded-full"></span> {status}</span>;
      default:
        return status;
    }
  };

  // Render cell content
  const renderCell = (row: TableRow, column: string) => {
    if (column === 'admins' && row.admins) {
      const { names, more } = row.admins;
      return (
        <div>
          {names.join(', ')}
          {more ? ` +${more} more` : ''}
        </div>
      );
    } else if (column === 'sessionStatus' && row.sessionStatus) {
      return getSessionStatusBadge(row.sessionStatus);
    } else if (column === 'setupStatus' && row.setupStatus) {
      return getSetupStatusBadge(row.setupStatus);
    } else {
      return row[column];
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white">
            {columns?.filter(col => visibleColumns?.includes(col.key))
              .map((column) => (
                <th 
                  key={column.key}
                  className={`bg-${headerColor} border-b border-gray-200 whitespace-nowrap p-3 text-left font-medium text-white text-sm`}
                >
                  <button
                    className="flex items-center space-x-1 focus:outline-none"
                    onClick={() => column.sortable ? requestSort(column.key) : null}
                    disabled={!column.sortable}
                  >
                    <span>{column.icon}</span>
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="ml-1">
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        ) : (
                          <ChevronDown size={14} className="text-gray-300" />
                        )}
                      </span>
                    )}
                  </button>
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {currentRows?.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns
                .filter(col => visibleColumns.includes(col.key))
                .map((column) => (
                  <td key={`${row.id}-${column.key}`} className="border-b border-gray-200 p-3 text-sm">
                    {renderCell(row, column.key)}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <div>
          {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, data?.length)} of {data?.length}
        </div>
        
        <div className="flex items-center space-x-2">
          <div>
            Rows per page: 
            <select 
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="ml-2 border border-gray-300 rounded p-1"
            >
              <option value={5}>5</option>
              <option value={9}>9</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span>{currentPage}/{Math.ceil(data?.length / rowsPerPage)}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(data?.length / rowsPerPage)))}
              disabled={currentPage >= Math.ceil(data?.length / rowsPerPage)}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTable;