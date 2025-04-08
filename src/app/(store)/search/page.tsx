import React from 'react'

const search = async ({
    searchParams,
}: {
    searchParams: { query: string; }
}) => {
    const { query } = searchParams;
    return (
        <div>{query}</div>
    )
}

export default search
