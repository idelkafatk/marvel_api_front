import React, {useEffect, useRef, useState} from "react";
import './charList.scss';
import PropTypes from "prop-types";
import useMarvelService from "../../services/MarvelService";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>
            break
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>
            break
        case 'confirmed':
            return <Component/>
            break
        case 'error':
            return <ErrorMessage/>
            break
        default:
            throw new Error('Unexpected process state')
    }
}

const CharList = (props) => {

    const [chars, setChars] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [charEnded, setCharEnded] = useState(false)

    const {process, setProcess, getAllCharacters} = useMarvelService()

    useEffect(() => {
        onRequest()
    }, [])

    const onCharsLoaded = (newCharList) => {
        let ended= newCharList.length < 9

        setChars(chars => [...chars, ...newCharList])
        setNewItemLoading(false)
        setOffset(offset => offset + 9)
        setCharEnded(ended)
    }

    const itemRefs = useRef([])

    const onFocus = (index) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'))
        itemRefs.current[index].classList.add('char__item_selected')
        itemRefs.current[index].focus()
    }

    const onRequest = (offset, initial) => {
        setNewItemLoading(!initial)
        getAllCharacters(offset)
            .then(onCharsLoaded)
            .then(() => setProcess('confirmed'))
    }

    const renderAllChars = () => {
        const items = chars.map((char, index) => {
            return (
                <CSSTransition key={index} timeout={500} classNames={'char__item'}>
                    <li className="char__item"
                        key={char.id}
                        ref={el => itemRefs.current[index] = el}
                        tabIndex={index}
                        onKeyDown={() => {
                            props.onCharSelected(char.id)
                            onFocus(index)
                        }}
                        onClick={() => {
                            props.onCharSelected(char.id)
                            onFocus(index)
                        }}>
                        <img  src={char.thumbnail} style={{objectFit: char.thumbnail.endsWith('image_not_available.jpg') ? 'contain' : 'cover'}}
                              alt={char.name}/>
                        <div className="char__name">{char.name}</div>
                    </li>
                </CSSTransition>
            )
        })

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    return (
        <div className="char__list">
            {setContent(process, () => renderAllChars(), newItemLoading)}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{display: charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;