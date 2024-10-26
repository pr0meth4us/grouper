// lib/api.ts

// Basic types
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = {
    /**
     * Process a list of items
     */
    async processList(content: string) {
        const response = await fetch(`${BASE_URL}/guest/get-list`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            throw new Error('Failed to process list');
        }

        return response.json();
    },

    /**
     * Generate groups from the processed list
     */
    async generateGroups({
                             size,
                             number,
                             exclusions
                         }: {
        size?: number;
        number?: number;
        exclusions?: string;
    }) {
        const params = new URLSearchParams();
        if (size) params.append('size', size.toString());
        if (number) params.append('number', number.toString());
        if (exclusions) params.append('exclusions', exclusions);

        const response = await fetch(
            `${BASE_URL}/guest/grouping?${params}`,
            {
                method: 'POST',
                credentials: 'include',
            }
        );

        if (!response.ok) {
            throw new Error('Failed to generate groups');
        }

        return response.json();
    }
};

export default api;