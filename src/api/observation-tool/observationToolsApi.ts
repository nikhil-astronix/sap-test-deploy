/**
 * Fetches observation tools data from the API
 * @param {Object} options - Configuration options
 * @param {string} options.bearerToken - JWT bearer token for authorization
 * @param {boolean|null} [options.isArchived=null] - Filter by archived status (true/false/null)
 * @param {string|null} [options.sortBy='name'] - Sort field (e.g., 'name')
 * @param {string|null} [options.sortOrder='asc'] - Sort order ('asc' or 'desc')
 * @param {number} [options.currPage=1] - Current page number (minimum: 1)
 * @param {number} [options.perPage=10] - Items per page (minimum: 1, maximum: 100)
 * @param {string|null} [options.search=null] - Search query string
 * @param {string} [options.baseUrl='https://sap-ab.duckdns.org'] - Base API URL
 * @returns {Promise<Object>} API response data
 */
export async function getObservationTools({
  bearerToken,
  isArchived = null,
  sortBy = 'name',
  sortOrder = 'asc',
  currPage = 1,
  perPage = 10,
  search = null,
  baseUrl = 'https://sap-ab.duckdns.org',
}: {
  bearerToken: string;
  isArchived?: boolean | null;
  sortBy?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
  currPage?: number;
  perPage?: number;
  search?: string | null;
  baseUrl?: string;
}): Promise<any> {
  // Validate required parameters
  if (!bearerToken) {
    throw new Error('Bearer token is required');
  }

  // Validate numeric parameters
  if (currPage < 1) {
    throw new Error('currPage must be at least 1');
  }
  if (perPage < 1 || perPage > 100) {
    throw new Error('perPage must be between 1 and 100');
  }

  // Validate sort order
  if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
    throw new Error('sortOrder must be either "asc" or "desc"');
  }

  // Construct URL with query parameters
  const url = new URL(`${baseUrl}/v1/observation_tool`);

  if (isArchived !== null) {
    url.searchParams.append('is_archived', isArchived.toString());
  }
  if (sortBy) {
    url.searchParams.append('sort_by', sortBy);
  }
  if (sortOrder) {
    url.searchParams.append('sort_order', sortOrder);
  }
  url.searchParams.append('curr_page', currPage.toString());
  url.searchParams.append('per_page', perPage.toString());
  if (search) {
    url.searchParams.append('search', search);
  }

  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching observation tools:', error);
    throw error;
  }
}

/**
 * Fetches a single observation tool by ID from the API
 * @param {Object} options - Configuration options
 * @param {string} options.bearerToken - JWT bearer token for authorization
 * @param {string} options.toolId - The observation tool ID
 * @param {string} [options.baseUrl='http://35.172.199.63'] - Base API URL
 * @returns {Promise<Object>} API response data
 */
export async function getObservationToolById({
  bearerToken,
  toolId,
  baseUrl = 'http://35.172.199.63',
}: {
  bearerToken: string;
  toolId: string;
  baseUrl?: string;
}): Promise<any> {
  if (!bearerToken) {
    throw new Error('Bearer token is required');
  }
  if (!toolId) {
    throw new Error('toolId is required');
  }
  const url = `${baseUrl}/v1/observation_tool/${toolId}`;
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
  };
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching observation tool by ID:', error);
    throw error;
  }
} 