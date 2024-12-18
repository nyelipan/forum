// SearchBar.tsx
import React from 'react';

interface SearchBarProps {
    placeholder: string;
    onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({placeholder, onSearch}) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value); // Pass the search term back to the parent
    };

    return (
        <input
            type='text'
            placeholder={placeholder}
            className='p-2 border rounded'
            onChange={handleInputChange}
        />
    );
};

export default SearchBar;
