/**
 * Transform session data from UI format to API format for editing
 */
export const transformSessionDataForAPI = (sessionData: any): any => {
	if (!sessionData) return null;

	// Parse the date from "June 09, 2025" to "2025-06-09"
	let formattedDate = sessionData.date;
	try {
		const parsedDate = new Date(sessionData.date);
		if (!isNaN(parsedDate.getTime())) {
			formattedDate = parsedDate.toISOString().split("T")[0];
		}
	} catch (error) {
		console.error("Error parsing date:", error);
	}

	// Extract classroom IDs or courses
	const classrooms =
		sessionData.classrooms?.map((classroom: any) => classroom.course) || [];

	return {
		id: sessionData.id,
		date: formattedDate,
		start_time: sessionData.start_time,
		end_time: sessionData.end_time,
		district: sessionData.district || "",
		school: sessionData.school,
		classrooms: classrooms,
		observation_tool: sessionData.observation_tool,
		users: sessionData.observer_ids || [],
		session_admin: sessionData.session_admin_id,
	};
};

/**
 * Transform API response back to UI format if needed
 */
export const transformAPIResponseToUIFormat = (apiData: any): any => {
	// Transform API response to UI format if needed
	// Add implementation as required
	return apiData;
};
