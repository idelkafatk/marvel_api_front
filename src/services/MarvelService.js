import {useHttp} from "../hooks/http.hook";

const useMarvelService = () => {
    const {request, clearError, process, setProcess} = useHttp()

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/'
    const _apiKey = 'apikey=96a0654105edbe800e49fb07aa5360f1'
    const _baseCharOffset = 210
    const _baseComicsOffset = 8



    const getAllCharacters = async (offset = _baseCharOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`)
        return res.data.results.map(_transformCharacter)
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&limit=1&${_apiKey}`)
        return _transformCharacter(res.data.results[0])
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?&${_apiKey}`)
        return _transformCharacter(res.data.results[0])
    }

    const _transformCharacter = (char) => ({
        id: char.id,
        name: char.name,
        description:
            char.description ?
                (char.description.length < 200? char.description : char.description.slice(0, 200) + '...' )
                : 'Info about this character not found',
        thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
        homepage: char.urls[0].url,
        wiki: char.urls[1].url,
        comics: char.comics.items
    })

    const getAllComics = async (offset = _baseComicsOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`)
        return res.data.results.map(_transformComics)
    }

    const getSingleComics = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?&${_apiKey}`)
        return _transformComics(res.data.results[0])
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            homepage: comics.urls[0].url,
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            description:
                comics.description ?
                    (comics.description.length < 200? comics.description : comics.description.slice(0, 200) + '...' )
                    : 'Info about this comics not found',
            pageCount: comics.pageCount + ' pages',
            lang: comics.textObjects[0].language,
            text: comics.textObjects[0].text,
            price: comics.prices[0].price
        }
    }

    return {
        clearError,
        getCharacter,
        getAllCharacters,
        getAllComics,
        getSingleComics,
        getCharacterByName,
        process,
        setProcess
    }
}

export default useMarvelService;