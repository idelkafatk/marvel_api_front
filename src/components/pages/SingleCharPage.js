import {useEffect, useState} from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import "./singleCharPage.scss";
import {useParams, Link} from "react-router-dom";
import setContent from "../../utils/setContent";

const SingleComicPage = () => {
    const {charId} = useParams()

    const [singleChar, setSingleChar] = useState(null)

    const {process, setProcess, clearError, getCharacter} = useMarvelService()

    useEffect(() => {
        updateSingleChar(charId)
    }, [charId])

    const updateSingleChar = (id) => {
        clearError()
        getCharacter(id)
            .then(onSingleCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onSingleCharLoaded = (res) => {
        setSingleChar(res)
    }

    return (
        <>
            {setContent(process, View, singleChar)}
        </>
    )
}

const View = ({data}) => {
    const {thumbnail, description, name} = data
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