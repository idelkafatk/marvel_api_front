import './searchForm.scss'
import {ErrorMessage as FormikErrorMessage, Field, Form, Formik} from "formik";
import {useState} from "react";
import useMarvelService from "../../services/MarvelService";
import * as Yup from 'yup'
import {Link} from "react-router-dom";
import ErrorMessage from "../errorMessage/ErrorMessage";

const SearchForm = () => {
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const {getCharacterByName, clearError, setProcess, error} = useMarvelService()

    const searchCharacter = (query) => {
        clearError()
        setLoading(true)

        getCharacterByName(query)
            .then(onResultLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onResultLoaded = (result) => {
        setLoading(false)
        setResult(result)
    }

    const renderResult = () => {

        return result ?
            <div className="char__search-wrapper">
                <div className="char__search-success">There is! Visit {result.name} page?</div>
                <Link to={`/characters/${result.id}`} className="button button__secondary">
                    <div className="inner">To page</div>
                </Link>
            </div> :
            <div className="char__search-error">
            The character was not found. Check the name and try again
            </div>
    }

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null

    const content = (result) ? renderResult() : null

    return (
        <div className="char__search-form">
            <Formik initialValues={{
                charName: '',
            }} validationSchema={Yup.object({
                charName: Yup.string().required('This field is required')
            })} onSubmit={({ charName }) => searchCharacter(charName)}>
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className={'char__search-wrapper'}>
                        <Field id={'charName'}
                               name={'charName'}
                               placeholder={'Enter name'}
                               type="text"/>
                        <button
                            type={'submit'}
                            className="button button__main"
                            disabled={loading}>
                            <div className={'inner'}>Find</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className="char__search-error" name="charName" />
                    {errorMessage}
                    {content}
                </Form>
            </Formik>
        </div>
    )
}

export default SearchForm