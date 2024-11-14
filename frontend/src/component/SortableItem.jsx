import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@mui/material';

const SortableItem = ({ id, index, backgroundStyle }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const sortableStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...backgroundStyle,
    };

    return (
        <Box
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            sx={{
                width: '100px',
                height: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#333',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f0f0f0',
                ...sortableStyle,
            }}
        >
            {index + 1}
        </Box>
    );
};

export default SortableItem;
