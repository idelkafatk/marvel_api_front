import './charInfo.scss';
import {Component} from "react";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import Skeleton from "../skeleton/Skeleton";
import PropTypes from "prop-types";

class CharInfo extends Component{
    state = {
        char: null,
        loading: false,
        error: false,
    }

    marvelService = new MarvelService()

    componentDidMount() {
        this.onUpdateChars()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.charId !== this.props.charId) {
            this.onUpdateChars()
        }
    }

    onUpdateChars = () => {
        const {charId} = this.props

        if (!charId) {
            return
        }

        this.onCharLoading()
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharsLoaded)
            .catch(this.onError)
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onCharsLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    componentDidCatch(error, errorInfo) {
        console.log(error)
        console.log(errorInfo)
        this.setState({error: true})
    }

    render() {
        const {char, loading, error} = this.state
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
                                {item.name}
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