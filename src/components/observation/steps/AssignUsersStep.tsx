import React, { useEffect } from "react";
import MultiSelect from "@/components/ui/MultiSelect";
import Dropdown from "@/components/ui/Dropdown";

interface User {
	id: string;
	name: string;
	email: string;
}

interface AssignUsersStepProps {
	users: User[];
	selectedUsers: string[];
	sessionAdmin: string;
	onUsersChange: (userIds: string[]) => void;
	onSessionAdminChange: (userId: string) => void;
	onNext: () => void;
	onBack: () => void;
	onCancel: () => void;
}

const AssignUsersStep = ({
	users,
	selectedUsers,
	sessionAdmin,
	onUsersChange,
	onSessionAdminChange,
	onNext,
	onBack,
	onCancel,
}: AssignUsersStepProps) => {
	// Format users data for Dropdown component
	const userOptions = users.map((user) => ({
		value: user.id,
		label: `${user.name} (${user.email})`,
	}));

	// Filter options for session admin to only include selected users
	const sessionAdminOptions = userOptions.filter((option) =>
		selectedUsers.includes(option.value)
	);

	// Reset session admin if it's not in the selected users list
	useEffect(() => {
		if (sessionAdmin && !selectedUsers.includes(sessionAdmin)) {
			onSessionAdminChange("");
		}
	}, [selectedUsers, sessionAdmin, onSessionAdminChange]);

	return (
		<div className='max-w-2xl mx-auto'>
			<div className='space-y-6'>
				<div>
					<label className='block text-[16px] text-balck-400 mb-2'>
						User(s)
					</label>
					<div className='space-y-2'>
						{selectedUsers.map((id) => {
							const user = users.find((u) => u.id === id);
							if (!user) return null;
							return (
								<div
									key={id}
									className='inline-flex items-center bg-emerald-50 text-emerald-700 px-4 py-1.5 border border-emerald-700 rounded-full mr-2'
								>
									<span>{user.name}</span>
									<button
										onClick={() =>
											onUsersChange(selectedUsers.filter((uid) => uid !== id))
										}
										className='ml-2'
									>
										<svg
											className='w-4 h-4'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M6 18L18 6M6 6l12 12'
											/>
										</svg>
									</button>
								</div>
							);
						})}
					</div>
					<MultiSelect
						options={users.map((user) => ({
							label: `${user.name} (${user.email})`,
							value: user.id,
						}))}
						values={selectedUsers}
						onChange={onUsersChange}
						placeholder='Select users'
						className='mt-2 bg-gray-50'
						showSelectedTags={false}
						showSlectedOptions={false}
					/>
				</div>

				<div>
					<label className='block text-[16px] text-balck-400 mb-2'>
						Session Admin
					</label>
					<Dropdown
						options={sessionAdminOptions}
						value={sessionAdmin}
						onChange={onSessionAdminChange}
						placeholder={
							selectedUsers.length > 0
								? "Select session admin"
								: "First select users above"
						}
						className='bg-gray-50'
						disabled={sessionAdminOptions.length === 0}
					/>
					{sessionAdminOptions.length === 0 && (
						<p className='text-sm text-gray-500 mt-1'>
							Please select users above to assign as session admin
						</p>
					)}
				</div>

				<div className='flex justify-between space-x-4 pt-6 w-full'>
					<button
						onClick={onBack}
						className='px-4 py-2 text-gray-700 hover:text-gray-900'
					>
						Back
					</button>

					<div className='flex space-x-4 justify-between full'>
						<button
							onClick={onCancel}
							className='px-4 py-2 text-gray-700 hover:text-gray-900 bg-[#F4F6F8] rounded-md '
						>
							Cancel
						</button>
						<button
							onClick={onNext}
							className='px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors'
							disabled={selectedUsers.length > 0 && !sessionAdmin}
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AssignUsersStep;
