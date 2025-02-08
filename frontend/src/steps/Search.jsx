import { useEffect, useState } from "react"
import { searchData } from "../services/search"
import { toast } from "sonner"

export const Search = ({ initialData }) => {
    const [data, setData] = useState(initialData)
    const [search, setSearch] = useState(() => {
        const searchParams = new URLSearchParams(window.location.search)
        return searchParams.get('q') ?? ''
    })

    const handleSearch = (event) => {
        setSearch(event.target.value)
    }

    useEffect(() => {
        const newPathname = search === '' ? window.location.pathname : `?q=${search}`
        window.history.replaceState({}, '', newPathname)
    }, [search])

    useEffect(() => {
        if (!search) {
            setData(initialData)
            return
        }

        // Llamar a la API para filtrar los resultados
        searchData(search)
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
    }, [search, initialData])

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
