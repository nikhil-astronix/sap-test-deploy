import { Metadata } from 'next';
import Usertable from '@/components/users/Usertable';

export const metadata: Metadata = {
  title: 'Users | Student Achievement Partners',
  description: 'Browse all users across districts. Add, update, or archive user accounts as needed.',
};

export default function UsersPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md border border-gray-100 h-full overflow-hidden">
      <Usertable />
    </div>
  );
} 