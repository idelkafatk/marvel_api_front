import './charInfo.scss';
import {useEffect, useState} from "react";
import useMarvelService from "../../services/MarvelService";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import setContent from "../../utils/setContent";

const CharInfo = (props) =>{
    const [char, setChar] = useState(null)
    const {charId} = props

    const {getCharacter, clearError, process, setProcess} = useMarvelService()

    useEffect(() => {
        onUpdateChars()
    }, [charId])

    const onUpdateChars = () => {

        if (!charId) {
            return
        }

        clearError()
        getCharacter(charId)
            .then(onCharsLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharsLoaded = (char) => {
        setChar(char)
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}

const View = (data) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data.data
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
                                <Link exac={'true'} to={`/comics/${item.resourceURI.replace(/\D/g, '').slice(1)}`}>{item.name}</Link>
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