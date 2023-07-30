import {useEffect, useState} from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import "./singleCharPage.scss";
import {useParams, Link} from "react-router-dom";

const SingleComicPage = () => {
    const {charId} = useParams()

    const [singleComics, setSingleComics] = useState(null)

    const {loading, error, clearError, getCharacter} = useMarvelService()

    useEffect(() => {
        updateSingleChar(charId)
    }, [charId])

    const updateSingleChar = (id) => {
        clearError()
        getCharacter(id)
            .then(onSingleCharLoaded)
    }

    const onSingleCharLoaded = (res) => {
        setSingleComics(res)
    }

    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading ? <Spinner/> : null
    const content = !(loading || errorMessage || !singleComics) ? <View char={singleComics}/>: null

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = (char) => {
    const {thumbnail, description, name} = char.char
    return (
        <div className="single-comic">
            <img src={thumbnail} alt="x-men" className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">
                    {description}
                </p>
            </div>
            <Link to={'/'} className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;