/**
 * Transform session data from UI format to API format for editing
 */
export const transformSessionDataForAPI = (sessionData: any): any => {
	if (!sessionData) return null;

	// Format date properly to prevent timezone issues
	const formatDate = (dateStr: string): string => {
		try {
			const parsedDate = new Date(dateStr);
			if (!isNaN(parsedDate.getTime())) {
				const year = parsedDate.getFullYear();
				const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
				const day = String(parsedDate.getDate()).padStart(2, "0");
				return `${year}-${month}-${day}`;
			}
		} catch (error) {
			console.error("Error parsing date:", error);
		}
		return dateStr; // Return original if parsing fails
	};

	// Format time to ISO format - returning only the time portion
	const formatTimeToISO = (timeStr: string, dateStr: string): string => {
		if (!timeStr) return new Date().toISOString().split("T")[1];

		try {
			const [time, period] = timeStr.split(" ");
			let [hours, minutes] = time.split(":").map(Number);

			// Convert to 24-hour format
			if (period === "PM" && hours !== 12) hours += 12;
			if (period === "AM" && hours === 12) hours = 0;

			// Create a date object with the correct date and time
			const formattedDate = formatDate(dateStr);
			const [year, month, day] = formattedDate.split("-").map(Number);

			const dateObj = new Date(year, month - 1, day, hours, minutes, 0, 0);
			return dateObj.toISOString().split("T")[1]; // Return only the time portion
		} catch (error) {
			console.error("Error formatting time:", error, timeStr);
			return new Date().toISOString().split("T")[1];
		}
	};

	// Apply formatting
	const formattedDate = formatDate(sessionData.date);
	const startTime = formatTimeToISO(sessionData.start_time, sessionData.date);
	const endTime = formatTimeToISO(sessionData.end_time, sessionData.date);

	// Extract classroom IDs
	const classrooms =
		sessionData.classrooms?.map((classroom: any) => classroom.id) || [];

	return {
		id: sessionData.id,
		date: formattedDate,
		start_time: startTime,
		end_time: endTime,
		district: localStorage.getItem("globalDistrict") || "string",
		school: sessionData.school_id || sessionData.school, // Use school_id if available
		classrooms: classrooms,
		observation_tool:
			sessionData.observation_tool_id || sessionData.observation_tool,
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
