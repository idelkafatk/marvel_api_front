import './charInfo.scss';
import {useState, useEffect} from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import Skeleton from "../skeleton/Skeleton";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

const CharInfo = (props) =>{
    const [char, setChar] = useState(null)
    const {charId} = props

    const {loading, error, getCharacter, clearError} = useMarvelService()

    useEffect(() => {
        onUpdateChars()
    }, [charId])

    const onUpdateChars = () => {
        clearError()
        if (!charId) {
            return
        }

        getCharacter(charId)
            .then(onCharsLoaded)
    }

    const onCharsLoaded = (char) => {
        setChar(char)
    }

    const skeleton = char || loading || error ? null : <Skeleton/>
    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading ? <Spinner/> : null
    const content = !(loading || errorMessage || !char) ? <View char={char}/> : null

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = (props) => {
    const {name, description, thumbnail, homepage, wiki, comics} = props.char
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail}
                     style={{objectFit: thumbnail.endsWith('image_not_available.jpg') ? 'contain' : 'cover'}}
                     alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics for this character'}
                {
                    comics?.map((item, i) => {
                        if (i > 10) return

                        return (
                            <li key={i} className="char__comics-item">
                                <Link exac to={`/comics/${item.resourceURI.replace(/\D/g, '').slice(1)}`}>{item.name}</Link>
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number

}
export default CharInfo;