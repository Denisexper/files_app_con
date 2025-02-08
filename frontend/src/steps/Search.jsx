import { useEffect, useState } from "react"

export const Searach = ({ initialData }) => {
    const [data, setData] = useState(initialData)
    const [search, setSearch] = useState('')

    const handleSearch = (event) => {
        setSearch(event.target.value)
    }

    useEffect (() => {
        if(search === ''){
            window.history.pushState({}, '', window.location.pathname)
            return 
        }
        window.history.pushState({}, '', `?q${search}`)
    }, [search])


    return (
        <div>
            <h1>Search</h1>
            <form>
            <input onChange={handleSearch} type="search" placeholder="Buscar informacon..." />
            </form>
        </div>
        
    )
}