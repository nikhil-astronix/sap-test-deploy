import { Metadata } from "next";
import CurriculumList from "@/components/curriculum/CurriculumList";

export const metadata: Metadata = {
	title: "Curricula | Student Achievement Partners",
	description: "View, edit, and organize all available curricula in one place.",
};

export default function CurriculumsPage() {
	return (
		<div className='container mx-auto px-4 py-8 bg-white rounded-lg shadow-md border border-gray-100 min-h-full overflow-hidden'>
			<CurriculumList />
		</div>
	);
}
