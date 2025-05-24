import React from "react";
import CreateSchoolForm from "@/components/school/CreateSchoolForm";

export default function NewSchoolPage() {
	return (
		<div className='container mx-auto px-4 py-8 bg-white rounded-lg shadow-md min-h-full'>
			<div className='max-w-3xl mx-auto h-auto'>
				<h1 className='text-[24px] text-black-400 mb-6 text-center'>
					Create School
				</h1>
				<p className='text-[#454F5B]-400 mb-8 text-center text-[16px]'>
					Fill the details below to add a new classroom.
				</p>
				<CreateSchoolForm />
			</div>
		</div>
	);
}
