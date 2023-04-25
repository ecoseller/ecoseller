import { IPermission } from "@/types/user";
import { useEffect, useState } from "react";

interface IPermissionsProps {
    permissions: IPermission[];
}

const SearchBar = ({ permissions }: IPermissionsProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };
    useEffect(() => {
        const results = permissions.filter(permission =>
            permission.name.toLowerCase().includes(searchTerm)
        );
        setSearchResults(results);
    }, [searchTerm]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
            />
            <ul>
                {searchResults.map(permission => (
                    <li key={permission}>{permissions}</li>
                ))}
            </ul>
        </div>
    );
}
export default SearchBar;