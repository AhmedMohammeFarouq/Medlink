export const getPagination = (page = 1, limit = 10) => {
    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const skip = (currentPage - 1) * perPage;

    return {
        page: currentPage,
        limit: perPage,
        skip,
    };
};

export const getPaginationMeta = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);

    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
};