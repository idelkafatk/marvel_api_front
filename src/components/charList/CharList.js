import React, {Component} from "react";
import './charList.scss';
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import PropTypes from "prop-types";

class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 1548,
        charEnded: false
    }

    marvelService = new MarvelService()
    myRefs = []

    onCharsLoaded = (newCharList) => {
        let ended= newCharList.length < 9

        this.setState(({chars, offset}) => ({
            chars: [...chars, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }

    onFocus = (index) => {
        this.myRefs.forEach(item => item.classList.remove('char__item_selected'))
        this.myRefs[index].classList.add('char__item_selected')
        this.myRefs[index].focus()
    }

    setNewRef = (ref) => {
        this.myRefs.push(ref)
    }

    onUpdateChars = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharsLoaded)
            .catch(this.onError)
    }

    componentDidMount() {
        this.onRequest()
    }

    onRequest = (offset) => {
        this.onCharListLoading()
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError)
    }

    renderAllChars = () => {
        return this.state.chars.map((char, index) => {
            return (
                <li className="char__item"
                    key={char.id}
                    ref={this.setNewRef}
                    tabIndex={index}
                    onKeyDown={() => {
                        this.props.onCharSelected(char.id)
                        this.onFocus(index)
                    }}
                    onClick={() => {
                        this.props.onCharSelected(char.id)
                        this.onFocus(index)
                    }}>
                    <img  src={char.thumbnail} style={{objectFit: char.thumbnail.endsWith('image_not_available.jpg') ? 'contain' : 'cover'}}
                         alt={char.name}/>
                    <div className="char__name">{char.name}</div>
                </li>
            )
        })
    }

    render() {
        const {loading, error, newItemLoading, offset, charEnded} = this.state

        const errorMessage = error ? <ErrorMessage/> : null
        const spinner = loading ? <Spinner/> : null
        const content = !(loading || errorMessage) ? this.renderAllChars() : null

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                <ul className="char__grid">
                    {content}
                </ul>
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{display: charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;