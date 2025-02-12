import { useEffect, useState } from "react"
import { searchData } from "../services/search.js"
import { toast } from "sonner"
import { useDebounce } from "@uidotdev/usehooks"

//debounce es un hook que nos permite esperar un tiempo antes de que se ejecute una funcion
const DEBOUNCE_TIME = 500;

export const Search = ({ initialData }) => {
    const [data, setData] = useState(initialData)
    const [search, setSearch] = useState(() => {
        const searchParams = new URLSearchParams(window.location.search)
        return searchParams.get('q') ?? ''
    })

    const debounceSearch = useDebounce(search, DEBOUNCE_TIME)

    const handleSearch = (event) => {
        setSearch(event.target.value)
    }

    useEffect(() => {
        const newPathname = debounceSearch === '' ? window.location.pathname : `?q=${debounceSearch}`
        window.history.replaceState({}, '', newPathname)
    }, [debounceSearch])

    useEffect(() => {
        if (!debounceSearch) {
            setData(initialData)
            return
        }

        // Llamar a la API para filtrar los resultados
        searchData(debounceSearch)
            .then((newData) => {
                if (!newData) {
                    toast.error("No data found")
                    return
                }

                setData(newData)
            })
            .catch((err) => {
                toast.error(err.message)
            })
    }, [debounceSearch, initialData])

    return (
        <div>
            <h1>Search</h1>
            <form>
                <input onChange={handleSearch} type="search" placeholder="Buscar información..." />
            </form>

            <ul>
                {
                data.map((row) => (
                    <li key={row.id}>
                        <article>
                            {Object.entries(row)
                            .map(([key, value]) => 
                                <p key={key}><strong>{key}:</strong> {value}</p>)
                            }
                        </article>
                    </li>
                ))}
            </ul>
        </div>
    )
}
