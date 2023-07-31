import {useEffect, useState} from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import "./SingleComicsPage.scss";
import {useParams, Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import setContent from "../../utils/setContent";
import AppBanner from "../appBanner/AppBanner";

const SingleComicPage = () => {
    const {comicsId} = useParams()

    const [singleComics, setSingleComics] = useState(null)

    const {process, setProcess, clearError, getSingleComics} = useMarvelService()

    useEffect(() => {
        updateSingleComics(comicsId)
    }, [comicsId])

    const updateSingleComics = (id) => {
        clearError()
        getSingleComics(id)
            .then(onSingleComicsLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onSingleComicsLoaded = (res) => {
        setSingleComics(res)
    }

    return (
        <>
            <AppBanner/>
            {setContent(process, View, singleComics)}
        </>
    )
}

const View = ({data}) => {
    const {thumbnail, title, text, pageCount, lang, price} = data
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