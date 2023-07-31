import {useEffect, useState} from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import "./SingleComicsPage.scss";
import {useParams, Link} from "react-router-dom";
import {Helmet} from "react-helmet";

const SingleComicPage = () => {
    const {comicsId} = useParams()

    const [singleComics, setSingleComics] = useState(null)

    const {loading, error, clearError, getSingleComics} = useMarvelService()

    useEffect(() => {
        updateSingleComics(comicsId)
    }, [comicsId])

    const updateSingleComics = (id) => {
        clearError()
        getSingleComics(id)
            .then(onSingleComicsLoaded)
    }

    const onSingleComicsLoaded = (res) => {
        setSingleComics(res)
    }

    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading ? <Spinner/> : null
    const content = !(loading || errorMessage || !singleComics) ? <View comic={singleComics}/>: null

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = (comic) => {
    const {thumbnail, title, text, pageCount, lang, price} = comic.comic
    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name="description"
                    content={`${title} comics book`}
                />
                <title>{title}</title>
            </Helmet>
            <img src={thumbnail} alt="x-men" className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">
                    {text}
                </p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {lang}</p>
                <div className="single-comic__price">{price}$</div>
            </div>
            <Link to={'/comics'} className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;