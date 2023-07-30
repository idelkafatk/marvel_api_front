import './comicsList.scss';
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import {CSSTransition, TransitionGroup} from "react-transition-group";

const ComicsList = () => {

    const [comics, setComics] = useState([])
    const [offset, setOffset] = useState(8)
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [comicsEnded, setComicsEnded] = useState(false)

    const {loading, error, getAllComics, clearError} = useMarvelService()

    useEffect(() => {
        updateComics()
    }, [])

    const updateComics = () => {
        clearError()
        getAllComics()
            .then(onComicsLoaded)
    }

    const onComicsLoaded = (res) => {
        let ended= res.length < 8

        setComics(chars => [...chars, ...res])
        setNewItemLoading(false)
        setOffset(offset => offset + 8)
        setComicsEnded(ended)
    }

    const onRequest = (offset) => {
        setNewItemLoading(true)

        getAllComics(offset)
            .then(onComicsLoaded)
    }

    const comicsList = () => {

        const comicsItems = comics.map((item, i) => {
            return (
                <CSSTransition key={i} timeout={500} classNames={'comics__item'}>
                    <li key={i} className="comics__item">
                        <Link to={`/comics/${item.id}`}>
                            <img src={item.thumbnail} alt="ultimate war" className="comics__item-img"/>
                            <div className="comics__item-name">{item.title}</div>
                            <div className="comics__item-price">{item.price}$</div>
                        </Link>
                    </li>
                </CSSTransition>
            )
        })

        return (
            <ul className="comics__grid">
                <TransitionGroup component={null}>
                    {comicsItems}
                </TransitionGroup>
            </ul>
        )
    }

    const items = comicsList()
    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading && !newItemLoading? <Spinner/> : null

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long"
                    onClick={() => onRequest(offset)}
                    disabled={newItemLoading}
                    style={{display: comicsEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;